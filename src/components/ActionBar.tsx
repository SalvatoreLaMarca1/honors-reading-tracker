
import { useNavigate } from "react-router-dom"
import "../App.css"

function ActionBar() {

    const navigate = useNavigate()

    return (
        <div className="hold-action-buttons">
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/honors-reading-tracker/read")}>Read Book</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/honors-reading-tracker/my-books")}>My Books</button>
        </div>
    )
}

export default ActionBar