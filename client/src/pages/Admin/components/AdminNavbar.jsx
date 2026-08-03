import useAuth from "../../../hooks/useAuth";

export default function AdminNavbar() {

    const { user } = useAuth();

    return (

        <header className="admin-navbar">

            <h1>

                Survey Platform Admin

            </h1>

            <div>

                Welcome,

                <strong>

                    {" "}
                    {user?.firstName}

                </strong>

            </div>

        </header>

    );

}