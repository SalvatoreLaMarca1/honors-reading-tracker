
import WeeklyGraph from "../components/WeeklyGraph"
import YearlyProgress from "../components/YearlyProgress"

function Dashboard() {

  return (
    <>
      <div className="dasboard-div">
        <YearlyProgress/>
        <WeeklyGraph/>
      </div>
    </>
  )
}

export default Dashboard