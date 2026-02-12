import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type UserProfile = {
    name : Text;
    gmail : ?Text;
    remainingLearningCredits : Nat;
    profileCreatedAt : Time.Time;
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      switch (profile1.name.compare(profile2.name)) {
        case (#equal) {
          Int.compare(
            profile1.profileCreatedAt,
            profile2.profileCreatedAt
          );
        };
        case (order) { order };
      };
    };
  };

  type Lesson = {
    id : Nat;
    title : Text;
    description : Text;
    video : Blob;
    creator : Principal;
    createdAt : Time.Time;
    creditCost : Nat;
  };

  module Lesson {
    public func compare(lesson1 : Lesson, lesson2 : Lesson) : Order.Order {
      switch (Int.compare(lesson1.createdAt, lesson2.createdAt)) {
        case (#equal) { lesson1.title.compare(lesson2.title) };
        case (order) { order };
      };
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let lessons = Map.empty<Nat, Lesson>();
  var nextLessonId = 1;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let newProfile : UserProfile = switch (userProfiles.get(caller)) {
      case (null) {
        {
          name = profile.name;
          gmail = profile.gmail;
          remainingLearningCredits = 100;
          profileCreatedAt = Time.now();
        };
      };
      case (?existingProfile) {
        {
          name = profile.name;
          gmail = profile.gmail;
          remainingLearningCredits = existingProfile.remainingLearningCredits;
          profileCreatedAt = existingProfile.profileCreatedAt;
        };
      };
    };

    userProfiles.add(caller, newProfile);
  };

  public shared ({ caller }) func completeLesson(lessonId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete lessons");
    };

    let userProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile does not exist!") };
      case (?profile) { profile };
    };

    let lesson = switch (lessons.get(lessonId)) {
      case (null) { Runtime.trap("Lesson does not exist!") };
      case (?lesson) { lesson };
    };

    if (userProfile.remainingLearningCredits < lesson.creditCost) {
      Runtime.trap("Not enough learning credits!");
    };

    let updatedProfile : UserProfile = {
      userProfile with
      remainingLearningCredits = userProfile.remainingLearningCredits - lesson.creditCost;
    };

    userProfiles.add(caller, updatedProfile);
  };

  // Lesson Functions
  public query ({ caller }) func getLesson(id : Nat) : async Lesson {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view lessons");
    };
    switch (lessons.get(id)) {
      case (null) { Runtime.trap("Lesson not found") };
      case (?lesson) { lesson };
    };
  };

  public query ({ caller }) func getAllLessons() : async [Lesson] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view lessons");
    };
    lessons.values().toArray().sort();
  };

  public query ({ caller }) func getLessonsByCreator(creator : Principal) : async [Lesson] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view lessons");
    };
    lessons.values().toArray().filter(
      func(lesson) {
        lesson.creator == creator;
      }
    );
  };

  public shared ({ caller }) func createLesson(title : Text, description : Text, video : Blob, creditCost : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create lessons");
    };

    if (title.isEmpty() or (title.size() < 3 or title.size() > 100)) {
      Runtime.trap("Title must be between 3-100 chars (exclusive).");
    };

    if (description.size() < 10 or description.size() > 5000) {
      Runtime.trap("Description must have length 10-5000 chars (exclusive)!");
    };

    if (creditCost < 1 or creditCost > 10) {
      Runtime.trap("Credit cost must be between 1 and 10 credits!");
    };

    if (video.size() > 100_000_000) {
      Runtime.trap("Video is too large! Must be under 100MB.");
    };

    let lessonId = nextLessonId;
    nextLessonId += 1;

    let lesson : Lesson = {
      id = lessonId;
      title;
      description;
      video;
      creator = caller;
      createdAt = Time.now();
      creditCost;
    };

    lessons.add(lessonId, lesson);
    lessonId;
  };
};
