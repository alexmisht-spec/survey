import { useState } from "react";
import { createSurvey, updateSurvey } from "../../../api/admin.survey";
import "./CreateSurveyModal.css";

export default function CreateSurveyModal({

    open,

    onClose,

    onCreated,

    survey = null

}) {

    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(() => ({
    title: survey?.title ?? "",
    description: survey?.description ?? "",
    reward: Number(survey?.reward ?? 100),
    timeEstimate: Number(survey?.timeEstimate ?? 10),
    status: survey?.status ?? "COMING_SOON",
}));

const [questions, setQuestions] = useState(() =>
    survey?.questions?.map((q) => ({
        id: q.id,
        question: q.question,
        questionType: q.questionType,
        placeholder: q.placeholder || "",
        required: q.required,
        options: Array.isArray(q.options)
            ? [...q.options]
            : [""],
    })) || []
);




    if (!open) return null;



function handleChange(e) {

    const { name, value } = e.target;

    setForm({

        ...form,

        [name]:
            name === "reward" || name === "timeEstimate"
                ? Number(value)
                : value,

    });

}

    function addQuestion() {

        setQuestions((prev) => [

            ...prev,

            {
                question: "",
                questionType: "TEXT",
                placeholder: "",
                required: true,
                options: [""],
            },

        ]);

    }

    function updateQuestion(index, field, value) {

        const updated = [...questions];

        updated[index][field] = value;

        setQuestions(updated);

    }

    function removeQuestion(index) {

        setQuestions((prev) =>
            prev.filter((_, i) => i !== index)
        );

    }

    function addOption(questionIndex) {

        const updated = [...questions];

        updated[questionIndex].options.push("");

        setQuestions(updated);

    }

    function updateOption(questionIndex, optionIndex, value) {

        const updated = [...questions];

        updated[questionIndex].options[optionIndex] = value;

        setQuestions(updated);

    }

    function removeOption(questionIndex, optionIndex) {

        const updated = [...questions];

        updated[questionIndex].options.splice(optionIndex, 1);

        setQuestions(updated);

    }
    function resetForm() {

    setForm({
        title: "",
        description: "",
        reward: 100,
        timeEstimate: 10,
        status: "COMING_SOON",
    });

    setQuestions([]);

}

    function validateSurvey() {

        if (!form.title.trim())
            return "Survey title is required.";

        if (!form.description.trim())
            return "Survey description is required.";

        if (questions.length === 0)
            return "Please add at least one question.";

        for (const q of questions) {

            if (!q.question.trim())
                return "Every question must have text.";

            if (
                ["RADIO", "CHECKBOX", "SELECT"].includes(q.questionType)
            ) {

                if (q.options.length === 0)
                    return "Choice questions require options.";

                if (
                    q.options.some(
                        (option) => !option.trim()
                    )
                ) {

                    return "Question options cannot be empty.";

                }

            }

        }

        return null;

    }

   async function handleSubmit() {

    const error = validateSurvey();

    if (error) {

        return alert(error);

    }

    try {

        setSaving(true);

        if (survey) {

            await updateSurvey(

                survey.id,

                {

                    ...form,

                    questions

                }

            );

            alert("Survey updated successfully.");

        }

        else {

            await createSurvey({

                ...form,

                questions

            });

            alert("Survey created successfully.");

        }

       if (onCreated) {
    onCreated();
}

resetForm();

onClose();

    }

    catch (error) {

        console.error(error);

        alert(

            error.response?.data?.message ||

            "Failed to save survey."

        );

    }

    finally {

        setSaving(false);

    }

}

    return (

        <div className="survey-modal-overlay">

            <div className="survey-modal">

                <div className="survey-modal-header">

                    <h2>

    {survey

        ? "Edit Survey"

        : "Create Survey"}

</h2>

                    <button onClick={onClose}>
                        ✖
                    </button>

                </div>

                <div className="survey-modal-body">

                    <label>Survey Title</label>

                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                    />

                    <label>Description</label>

                    <textarea
                        rows="4"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <label>Reward (KES)</label>

                    <input
                        type="number"
                        name="reward"
                        value={form.reward}
                        onChange={handleChange}
                    />

                    <label>Estimated Time (Minutes)</label>

                    <input
                        type="number"
                        name="timeEstimate"
                        value={form.timeEstimate}
                        onChange={handleChange}
                    />

                    <label>Status</label>

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >

                        <option value="COMING_SOON">
                            Coming Soon
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="CLOSED">
                            Closed
                        </option>

                    </select>

                    <hr />

                    <h3>Questions</h3>

                    <button
                        className="add-question-btn"
                        type="button"
                        onClick={addQuestion}
                    >
                        + Add Question
                    </button>

                    <br />
                    <br />

                    {questions.map((q, index) => (

                        <div
                            key={index}
                            className="question-card"
                        >

                            <h4>

                                Question {index + 1}

                            </h4>

                            <label>Question</label>

                            <input

                                value={q.question}

                                onChange={(e) =>

                                    updateQuestion(

                                        index,

                                        "question",

                                        e.target.value

                                    )

                                }

                            />

                            <br />

                            <br />

                            <label>Question Type</label>

                            <select

                                value={q.questionType}

                                onChange={(e) =>

                                    updateQuestion(

                                        index,

                                        "questionType",

                                        e.target.value

                                    )

                                }

                            >

                                <option value="TEXT">Text</option>

                                <option value="TEXTAREA">Textarea</option>

                                <option value="RADIO">Radio</option>

                                <option value="CHECKBOX">Checkbox</option>

                                <option value="SELECT">Select</option>

                                <option value="NUMBER">Number</option>

                                <option value="DATE">Date</option>

                            </select>

                            <br />
                            <br />

                            {["TEXT","TEXTAREA","NUMBER","DATE"].includes(q.questionType) && (

                                <>

                                    <label>Placeholder</label>

                                    <input

                                        value={q.placeholder}

                                        placeholder="Placeholder..."

                                        onChange={(e) =>

                                            updateQuestion(

                                                index,

                                                "placeholder",

                                                e.target.value

                                            )

                                        }

                                    />

                                    <br />
                                    <br />

                                </>

                            )}

                            {["RADIO","CHECKBOX","SELECT"].includes(q.questionType) && (

                                <>

                                    <h4>Options</h4>

                                    {q.options.map((option, optionIndex) => (

                                        <div
                                            key={optionIndex}
                                            className="option-row"
                                        >

                                            <input

                                                value={option}

                                                placeholder={`Option ${optionIndex + 1}`}

                                                onChange={(e) =>

                                                    updateOption(

                                                        index,

                                                        optionIndex,

                                                        e.target.value

                                                    )

                                                }

                                            />

                                            <button
                                                className="delete-btn"
                                                type="button"
                                                onClick={() =>
                                                    removeOption(
                                                        index,
                                                        optionIndex
                                                    )
                                                }
                                            >

                                                ✖

                                            </button>

                                        </div>

                                    ))}

                                    <br />

                                    <button
                                        className="add-option-btn"
                                        type="button"
                                        onClick={() =>
                                            addOption(index)
                                        }
                                    >

                                        + Add Option

                                    </button>

                                    <br />
                                    <br />

                                </>

                            )}

                            <div className="required-row">

                                <input

                                    type="checkbox"

                                    checked={q.required}

                                    onChange={(e) =>

                                        updateQuestion(

                                            index,

                                            "required",

                                            e.target.checked

                                        )

                                    }

                                />

                                <span>Required</span>

                            </div>

                            <br />

                            <button

                                className="delete-btn"

                                type="button"

                                onClick={() =>
                                    removeQuestion(index)
                                }

                            >

                                Delete Question

                            </button>

                        </div>

                    ))}

                </div>

                <div className="survey-modal-footer">
<button
    onClick={() => {
        resetForm();
        onClose();
    }}
>
    Cancel
</button>

                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                    >

                       {saving

    ? "Saving..."

    : survey

        ? "Update Survey"

        : "Create Survey"}

                    </button>

                </div>

            </div>

        </div>

    );

}