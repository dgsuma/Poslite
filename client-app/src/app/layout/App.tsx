import React, { useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";
// import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
// import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore);
  // const [activities, setActivities] = useState<IActivity[]>([]); // we can add useState hook as many times as we want
  // const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
  //   null
  // );
  // const [editMode, setEditMode] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const [submitting, setSubmitting] = useState(false);
  // const [target, setTarget] = useState(''); // use to isolate Delete button's loding effect

  // const handleSelectActivity = (id: string) => {
  //   setSelectedActivity(activities.filter((a) => a.id === id)[0]); // this filter out other activity id's, apart from the id that we clicked
  //   setEditMode(false);
  // };

  // const handleOpenCreateForm = () => {
  //   setSelectedActivity(null);
  //   setEditMode(true);
  // };

  // const handleCreateActivity = (activity: IActivity) => {
  //   setSubmitting(true);  // adding 1sec subitting delay, when submitt data
  //   agent.Activities.create(activity).then(() => {
  //     setActivities([...activities, activity]);
  //     setSelectedActivity(activity);
  //     setEditMode(false);
  //   }).then(() => setSubmitting(false));
  // };

  // const handleEditActivity = (activity: IActivity) => {
  //   setSubmitting(true); // adding 1sec subitting delay, when submitt data
  //   agent.Activities.update(activity).then(() => {
  //     setActivities([
  //       ...activities.filter((a) => a.id !== activity.id),
  //       activity,
  //     ]);
  //     setSelectedActivity(activity);
  //     setEditMode(false);
  //   }).then(() => setSubmitting(false));
  // };

  // const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => { // event is a React.SyntheticEvent. use to isolate Delete button's loding effect
  //   setSubmitting(true); // adding 1sec submitting delay, when submitt data
  //   setTarget(event.currentTarget.name)
  //   agent.Activities.delete(id).then(() => {
  //     setActivities([...activities.filter((a) => a.id !== id)]);
  //   }).then(() => setSubmitting(false));
  // };

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />   // adding 1sec loading delay, when load app 

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          // activities={activityStore.activities}
          // selectActivity={handleSelectActivity}

          // setEditMode={setEditMode}
          // setSelectedActivity={setSelectedActivity}
          // createActivity={handleCreateActivity}
          // editActivity={handleEditActivity}
          // deleteActivity={handleDeleteActivity}
          // submitting={submitting}
          // target={target}
        />
      </Container>
    </Fragment>
  );
};

export default observer(App);
