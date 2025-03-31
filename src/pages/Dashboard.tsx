
import WeeklyGraph from "../components/WeeklyGraph"
// import ActionBar from "../components/ActionBar"
import YearlyProgress from "../components/YearlyProgress"

function Dashboard() {

  return (
    <>
      <div className="dasboard-div">
        <YearlyProgress/>
        <WeeklyGraph/>
        {/* <ActionBar/> */}
      </div>
    </>
  )
}

export default Dashboard