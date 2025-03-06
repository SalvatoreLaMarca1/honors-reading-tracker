
import WeeklyGraph from "../components/WeeklyGraph"
import ActionBar from "../components/ActionBar"
import "../styles/Dashboard.css"
import YearlyProgress from "../components/YearlyProgress"

function Dashboard() {
  return (
    <div className="dasboard-div">

      <h1>Read Now</h1>
      
      <YearlyProgress/>
      <WeeklyGraph/>
      <ActionBar/>


      
    </div>
  )
}

export default Dashboard