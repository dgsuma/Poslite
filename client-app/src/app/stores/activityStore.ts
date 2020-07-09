import { IActivity } from "./../models/activity";
import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";

configure({ enforceActions: "always" }); // apply strict-mode

class ActivityStore {
  @observable activityRegistry = new Map(); // observable.map(), more powerfull than array to store data
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | undefined;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitting = false;
  @observable target = ""; // In order to isolate the delete button

  // computed function to sorted out activities in dates order
  @computed get activitiesByDate() {
    // Since activityRegistry is not an Array we have to use the code 'Array.from(this.activityRegistry.values())'
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    ); // since date is string we have to parse() the Date
  }

  // We have to wrap "agent.Activities.list()" method in a try catch block. If something goes wrong, we can catch the error
  @action loadActivities = async () => {
    // Though we not actually returning anything from loadActivities method, when we use asyn method we implicitly retrn Promise<void>
    this.loadingInitial = true; // mutate the state in MobX is allowed
    try {
      const activities = await agent.Activities.list(); // using await keyword, we blocked the execution of anything below await keyword, until list() fullfiled
      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0]; // add logic to filter out (.9913777) after the '.' from the time value
          this.activityRegistry.set(activity.id, activity); // observable.map(), more powerfull than array to store data
        });
        this.loadingInitial = false; // mutate the state again in MobX stric-mode is allowed, inside runInAction(() => {}) cllback function
      });
    } catch (error) {
      runInAction("load activities error", () => {
        this.loadingInitial = false; // mutate the state again in MobX stric-mode is allowed, inside runInAction(() => {}) cllback function
      });
      console.log(error);
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("creating activity", () => {
        this.activityRegistry.set(activity.id, activity); // observable.map(), more powerfull than array to set() or store data
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("create activity error", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction("editing an activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction("edit activity error", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true; // adding 1sec submitting delay, when submitt data
    this.target = event.currentTarget.name; // isolate delete button when press Edit button
    try {
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => {
        this.activityRegistry.delete(id); // observable.map(), more powerfull than array to delete() data
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction("delete activity error", () => {
        this.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  };

  /*
  // Promise then() channing
  @action loadActivities = () => {
    this.loadingInitial = true; // mutate the state in MobX is allowed
    agent.Activities.list() // list() method returns Promise<IActivity[]. Untill list() fullfiled, statements inside the then() not executed
      .then((activities) => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0]; // add logic to filter out (.9913777) after the '.' from the time value
          this.activities.push(activity);
        });
      })
      .catch((error) => console.log(error))
      .finally(() => (this.loadingInitial = false));
  };
  */

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id); // observable.map(), more powerfull than array to get data
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
