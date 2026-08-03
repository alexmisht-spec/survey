import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVerification } from "../../api/verification.api";
import "./UploadVerification.css";

export default function UploadVerification() {
    const navigate = useNavigate();

    const [files, setFiles] = useState({
        idFront: null,
        idBack: null,
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFiles({
            ...files,
            [e.target.name]: e.target.files[0],
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!files.idFront || !files.idBack) {
            return alert("Please upload all required documents.");
        }

        const formData = new FormData();

        formData.append("idFront", files.idFront);
        formData.append("idBack", files.idBack);

        try {

            setLoading(true);

            const { data } = await uploadVerification(formData);

            alert(data.message);

            navigate("/verification-pending");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Upload failed."
            );

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="verification-page">

            <div className="verification-card">

                <h1>Identity Verification</h1>

                <p className="subtitle">
                    To protect our platform and advertisers, every member
                    must verify their identity before accessing paid surveys.
                </p>

                <div className="verification-info">

                    <div className="info-box">
                        <strong>📄 Front of National ID</strong>
                        <span>Upload a clear photo or PDF.</span>
                    </div>

                    <div className="info-box">
                        <strong>🪪 Back of National ID</strong>
                        <span>Ensure all text is readable.</span>
                    </div>

                </div>

                <form onSubmit={handleSubmit} className="verification-form">

                    <div className="upload-group">

                        <label>Front of National ID</label>

                        <input
                            type="file"
                            name="idFront"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleChange}
                        />

                    </div>

                    <div className="upload-group">

                        <label>Back of National ID</label>

                        <input
                            type="file"
                            name="idBack"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        className="submit-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Uploading Documents..."
                            : "Submit for Verification"}
                    </button>

                </form>

                <div className="verification-note">

                    <h3>Review Process</h3>

                    <ul>

                        <li>Verification normally takes less than 24 hours.</li>

                        <li>You'll receive a notification once approved.</li>

                        <li>Surveys remain locked until approval.</li>

                        <li>Your documents are securely encrypted and stored.</li>

                    </ul>

                </div>

            </div>

        </div>
    );
}
