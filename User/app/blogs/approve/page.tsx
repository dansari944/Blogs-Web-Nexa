"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ApproveBlog() {
    const params = useSearchParams();

    const [status, setStatus] = useState("Approving...");

    useEffect(() => {
        const approveBlog = async () => {
            try {
                const token = params.get("token");

                if (!token) {
                    setStatus("Invalid approval link");
                    return;
                }

                await axios.post("http://localhost:7000/api/blogs/approve", { token });

                setStatus("Blog published successfully");

            } catch (error) {
                console.error('error: ', error);
                setStatus("Approval failed");
            }
        };

        approveBlog();
    }, []);

    return (
        <div className="text-center mt-20">
            <h2>{status}</h2>
        </div>
    );
}