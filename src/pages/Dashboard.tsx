
import WeeklyGraph from "../components/WeeklyGraph"
import ActionBar from "../components/ActionBar"
import YearlyProgress from "../components/YearlyProgress"
import { getAllBooks } from "../supabase"

function Dashboard() {

  

  const handleClick = async () => {
    try {
      const books = await getAllBooks();
      console.log("Users?")
      console.log(books); // Do something with the books data
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }


  return (
    <div className="dasboard-div">

      <h1 onClick={handleClick}>Read Now</h1>
      
      <YearlyProgress/>
      <WeeklyGraph/>
      <ActionBar/>


      
    </div>
  )
}

export default Dashboard