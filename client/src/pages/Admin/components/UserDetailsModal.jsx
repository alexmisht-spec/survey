import { useEffect, useState } from "react";

import {
    getVerification,
    openDocument,
    downloadDocument,
    approveVerification,
    rejectVerification,
} from "../../../api/admin.api";

export default function UserDetailsModal({
    verificationId,
    onClose,
    refresh,
}) {
    const [verification, setVerification] = useState(null);
    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [rejectMode, setRejectMode] = useState(false);
    const [reason, setReason] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadVerification() {
            try {
                const { data } = await getVerification(
                    verificationId
                );

                if (mounted) {
                    setVerification(data.verification);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        if (verificationId) {
            loadVerification();
        }

        return () => {
            mounted = false;
        };
    }, [verificationId]);

    async function handleApprove() {
        try {
            setSaving(true);

            const { data } =
                await approveVerification(
                    verification.id
                );

            alert(data.message);

            refresh();

            onClose();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to approve verification."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleReject() {
        if (!reason.trim()) {
            return alert(
                "Please enter a rejection reason."
            );
        }

        try {
            setSaving(true);

            const { data } =
                await rejectVerification(
                    verification.id,
                    reason
                );

            alert(data.message);

            refresh();

            onClose();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to reject verification."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="modal">
                <div className="modal-content">
                    <h3>Loading...</h3>
                </div>
            </div>
        );
    }

    if (!verification) return null;

    const profile = verification.user.profile;

    return (
        <div className="modal">
            <div
                className="modal-content"
                style={{
                    maxWidth: 750,
                    margin: "50px auto",
                    background: "#fff",
                    padding: 30,
                    borderRadius: 10,
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        float: "right",
                        cursor: "pointer",
                    }}
                >
                    ✖
                </button>

                <h2>
                    {verification.user.firstName}{" "}
                    {verification.user.lastName}
                </h2>

                <hr />

                <h3>User Information</h3>

                <p>
                    <strong>Email:</strong>{" "}
                    {verification.user.email}
                </p>

                <p>
                    <strong>Phone:</strong>{" "}
                    {verification.user.phone}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {verification.status}
                </p>

                <hr />

                <h3>Profile Information</h3>

                <p>
                    <strong>Gender:</strong>{" "}
                    {profile?.gender || "-"}
                </p>

                <p>
                    <strong>Date of Birth:</strong>{" "}
                    {profile?.dateOfBirth
                        ? new Date(
                              profile.dateOfBirth
                          ).toLocaleDateString()
                        : "-"}
                </p>

                <p>
                    <strong>County:</strong>{" "}
                    {profile?.county || "-"}
                </p>

                <p>
                    <strong>National ID:</strong>{" "}
                    {profile?.nationalId || "-"}
                </p>

                <hr />

                <h3>Verification Documents</h3>

                {[
                    {
                        title: "National ID (Front)",
                        type: "front",
                        filename: "Front_ID",
                    },
                    {
                        title: "National ID (Back)",
                        type: "back",
                        filename: "Back_ID",
                    },
                    {
                        title: "KRA Certificate",
                        type: "kra",
                        filename: "KRA_Certificate",
                    },
                ].map((doc) => (
                    <div
                        key={doc.type}
                        style={{
                            border: "1px solid #ddd",
                            padding: 15,
                            borderRadius: 8,
                            marginBottom: 15,
                        }}
                    >
                        <strong>{doc.title}</strong>

                        <br />
                        <br />

                        <button
                            onClick={() =>
                                openDocument(
                                    verification.id,
                                    doc.type
                                )
                            }
                        >
                            👁 View
                        </button>

                        {" "}

                        <button
                            onClick={() =>
                                downloadDocument(
                                    verification.id,
                                    doc.type,
                                    doc.filename
                                )
                            }
                        >
                            ⬇ Download
                        </button>
                    </div>
                ))}

                <hr />

                <h3>Verification Decision</h3>

                <div
                    style={{
                        display: "flex",
                        gap: 15,
                    }}
                >
                    <button
                        onClick={handleApprove}
                        disabled={saving}
                        style={{
                            background: "green",
                            color: "#fff",
                            padding: "10px 20px",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        {saving
                            ? "Processing..."
                            : "Approve"}
                    </button>

                    <button
                        onClick={() =>
                            setRejectMode(
                                !rejectMode
                            )
                        }
                        disabled={saving}
                        style={{
                            background: "red",
                            color: "#fff",
                            padding: "10px 20px",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Reject
                    </button>
                </div>

                {rejectMode && (
                    <div
                        style={{
                            marginTop: 20,
                        }}
                    >
                        <textarea
                            rows={5}
                            placeholder="Reason for rejection..."
                            value={reason}
                            onChange={(e) =>
                                setReason(
                                    e.target.value
                                )
                            }
                            style={{
                                width: "100%",
                                padding: 10,
                            }}
                        />

                        <br />
                        <br />

                        <button
                            onClick={handleReject}
                            disabled={saving}
                        >
                            Confirm Rejection
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}