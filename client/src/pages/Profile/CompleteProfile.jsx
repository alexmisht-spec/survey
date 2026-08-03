import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProfile } from "../../api/profile.api";

export default function CompleteProfile() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        nationalId: "",
        mpesaNumber: "",
        paymentMethod: "MPESA",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await createProfile(form);

            alert("Profile completed successfully.");

            navigate("/upload-verification");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to save profile."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div
            style={{
                maxWidth: 500,
                margin: "40px auto",
                padding: 30,
                border: "1px solid #ddd",
                borderRadius: 10,
            }}
        >

            <h2>Complete Your Profile</h2>

            <form onSubmit={handleSubmit}>

                <input
                    name="nationalId"
                    placeholder="National ID"
                    value={form.nationalId}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    name="mpesaNumber"
                    placeholder="M-Pesa Number"
                    value={form.mpesaNumber}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                >
                    <option value="MPESA">M-Pesa</option>
                </select>

                <br /><br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Profile"}
                </button>

            </form>

        </div>

    );

}