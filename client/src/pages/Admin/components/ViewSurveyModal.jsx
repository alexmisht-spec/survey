import "./ViewSurveyModel.css";

export default function ViewSurveyModal({

    open,
    survey,
    onClose

}) {

    if (!open || !survey) return null;

    return (

        <div className="survey-modal-overlay">

            <div className="survey-modal">

                <div className="survey-modal-header">

                    <h2>

                        {survey.title}

                    </h2>

                    <button onClick={onClose}>

                        ✖

                    </button>

                </div>

                <div className="survey-modal-body">

                    <p>

                        <strong>Description:</strong>

                    </p>

                    <p>

                        {survey.description}

                    </p>

                    <br />

                    <p>

                        <strong>Reward:</strong>

                        KSh {survey.reward}

                    </p>

                    <p>

                        <strong>Estimated Time:</strong>

                        {survey.timeEstimate} Minutes

                    </p>

                    <p>

                        <strong>Status:</strong>

                        {survey.status}

                    </p>

                    <hr />

                    <h3>

                        Questions

                    </h3>

                    {survey.questions.map((question, index) => (

                        <div
                            key={question.id}
                            className="question-preview"
                        >

                            <h4>

                                {index + 1}. {question.question}

                            </h4>

                            <p>

                                <strong>Type:</strong>

                                {question.questionType}

                            </p>

                            <p>

                                <strong>Required:</strong>

                                {question.required
                                    ? "Yes"
                                    : "No"}

                            </p>

                            {question.placeholder && (

                                <p>

                                    <strong>Placeholder:</strong>

                                    {question.placeholder}

                                </p>

                            )}

                            {(question.questionType ===
                                "RADIO" ||

                                question.questionType ===
                                    "CHECKBOX" ||

                                question.questionType ===
                                    "SELECT") && (

                                <>

                                    <strong>

                                        Options

                                    </strong>

                                    <ul>

                                        {question.options?.map(

                                            (option, i) => (

                                                <li key={i}>

                                                    {option}

                                                </li>

                                            )

                                        )}

                                    </ul>

                                </>

                            )}

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );

}