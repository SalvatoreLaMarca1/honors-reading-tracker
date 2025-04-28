
import "../App.css"
import PreDashBar from "../components/PreDashBar"
import salImage from "../assets/salimage.jpeg"

function About() {
    return (
        <>
            <PreDashBar/>
            <div className="about-area">
                <div className="about-text-area">
                    <div>
                        <p className="about-text">
                            Read Now is a reading habit tracker created as an honors capstone project during the Spring 2025 semester at Commonwealth University - Bloomsburg by Salvatore La Marca. The design, development, and execution of this project acted as a realistic practice of the software design process.
                        </p>
                    </div>
                </div>
                <div className="image-container">
                    <img src={salImage} alt="Author Photo" />
                </div>
            </div>
        </>
    )
}

export default About