export default function QuestionRenderer({
    question,
    value,
    onChange,
}) {

    switch (question.questionType) {

        case "TEXT":

            return (
                <input
                    type="text"
                    placeholder={
                        question.placeholder ||
                        "Type your answer..."
                    }
                    value={value || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                />
            );

        case "TEXTAREA":

            return (
                <textarea
                    rows={5}
                    placeholder={
                        question.placeholder ||
                        "Type your answer..."
                    }
                    value={value || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                />
            );

        case "NUMBER":

            return (
                <input
                    type="number"
                    value={value || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                />
            );

        case "DATE":

            return (
                <input
                    type="date"
                    value={value || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                />
            );

        case "RADIO":

            return (

                <div>

                    {question.options?.map((option) => (

                        <label
                            key={option}
                            style={{
                                display: "block",
                                marginBottom: 10,
                            }}
                        >

                            <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={value === option}
                                onChange={(e) =>
                                    onChange(e.target.value)
                                }
                            />

                            {" "}

                            {option}

                        </label>

                    ))}

                </div>

            );

        case "CHECKBOX":

            return (

                <div>

                    {question.options?.map((option) => {

                        const values = value || [];

                        return (

                            <label
                                key={option}
                                style={{
                                    display: "block",
                                    marginBottom: 10,
                                }}
                            >

                                <input
                                    type="checkbox"
                                    checked={values.includes(option)}
                                    onChange={(e) => {

                                        if (e.target.checked) {

                                            onChange([
                                                ...values,
                                                option,
                                            ]);

                                        } else {

                                            onChange(
                                                values.filter(
                                                    (item) =>
                                                        item !== option
                                                )
                                            );

                                        }

                                    }}
                                />

                                {" "}

                                {option}

                            </label>

                        );

                    })}

                </div>

            );

        case "SELECT":

            return (

                <select
                    value={value || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                >

                    <option value="">
                        Select an option
                    </option>

                    {question.options?.map((option) => (

                        <option
                            key={option}
                            value={option}
                        >

                            {option}

                        </option>

                    ))}

                </select>

            );

        default:

            return <p>Unsupported question type.</p>;

    }

}