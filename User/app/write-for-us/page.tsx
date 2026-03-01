import Link from "next/link";

export default function WriteForUsPage() {
    return (
        <main className="bg-white text-gray-900">

            {/* HERO */}
            <section className="bg-gradient-to-r from-primary to-indigo-700 text-white py-24 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        Write For Us
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
                        Share strategic insights. Challenge industry thinking. Help shape the future of digital growth.
                    </p>
                </div>
            </section>

            {/* INTRO */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-heading text-3xl font-semibold mb-6">
                        We Publish Advanced, Data-Driven Marketing Insights
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        We’re not looking for beginner marketing advice. We’re looking for experienced professionals
                        who have executed, tested, optimized, and scaled campaigns.
                        If you can bring real-world experience, frameworks, and measurable results — we’d love to hear from you.
                    </p>
                </div>
            </section>

            {/* TOPICS */}
            <section className="bg-muted py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-heading text-3xl font-semibold text-center mb-12">
                        Topics We’re Interested In
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            "Advanced SEO & Technical Optimization",
                            "Performance Marketing & Paid Media Scaling",
                            "Conversion Rate Optimization (CRO)",
                            "Marketing Automation & CRM Strategy",
                            "Analytics & Attribution Models",
                            "Growth Systems & Lead Generation",
                        ].map((topic, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-2xl shadow-card hover:shadow-card-hover transition"
                            >
                                <h3 className="font-heading text-lg font-semibold mb-2">
                                    {topic}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Deep, actionable insights backed by real-world data and case studies.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INDUSTRIES */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="font-heading text-3xl font-semibold mb-12">
                        Preferred Industry Experience
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-gray-700 font-medium">
                        {[
                            "eCommerce",
                            "B2B & SaaS",
                            "Real Estate",
                            "Healthcare",
                            "Higher Education",
                            "Franchise & Retail",
                        ].map((industry, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-xl shadow-sm"
                            >
                                {industry}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GUIDELINES */}
            <section className="bg-muted py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-heading text-3xl font-semibold text-center mb-12">
                        Editorial Standards
                    </h2>

                    <ul className="space-y-5 text-lg text-gray-700">
                        <li>✔ Minimum 1,500 words — in-depth and comprehensive.</li>
                        <li>✔ 100% original and unpublished content.</li>
                        <li>✔ Back up insights with data, experiments, or case studies.</li>
                        <li>✔ Clear structure with proper H2/H3 headings.</li>
                        <li>✔ Strategic thinking over surface-level advice.</li>
                        <li>✔ No promotional or affiliate-heavy content.</li>
                    </ul>
                </div>
            </section>

            {/* PROCESS */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="font-heading text-3xl font-semibold mb-12">
                        How to Contribute
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div>
                            <h3 className="font-heading text-xl font-semibold mb-4">01 — Pitch</h3>
                            <p className="text-gray-600">
                                Send 2–3 topic ideas with a brief outline and links to your previous work.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-heading text-xl font-semibold mb-4">02 — Approval</h3>
                            <p className="text-gray-600">
                                If approved, we’ll provide formatting guidance and timeline details.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-heading text-xl font-semibold mb-4">03 — Submit</h3>
                            <p className="text-gray-600">
                                Deliver your draft via Google Doc with editing access enabled.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FORM */}
            <section className="bg-muted py-20 px-6">
                <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                    <h2 className="font-heading text-3xl font-semibold text-center mb-8">
                        Submit Your Pitch
                    </h2>

                    <form className="space-y-6">

                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        />

                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        />

                        <input
                            type="url"
                            placeholder="Website URL"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        />

                        <textarea
                            rows={4}
                            placeholder="Links to 2–3 published articles"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        />

                        <textarea
                            rows={4}
                            placeholder="3 proposed guest post ideas (with brief overview)"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        />

                        <textarea
                            rows={3}
                            placeholder="Additional Notes (optional)"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                        />

                        <button
                            type="submit"
                            className="w-full bg-secondary text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition"
                        >
                            Submit Proposal
                        </button>
                    </form>
                </div>
            </section>

        </main>
    );
}
