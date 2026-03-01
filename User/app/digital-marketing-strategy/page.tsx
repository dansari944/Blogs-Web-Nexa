import Link from "next/link";

export default function DigitalMarketingStrategyPage() {
    return (
        <main className="bg-white text-gray-900">

            {/* HERO */}
            <section className="bg-gradient-to-br from-indigo-700 via-primary to-indigo-900 text-white py-32 px-6 text-center">
                <div className="max-w-5xl mx-auto">
                    <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        Growth Isn’t Random. It’s Engineered.
                    </h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
                        We build intelligent marketing ecosystems that transform attention into authority,
                        authority into demand, and demand into revenue.
                    </p>
                </div>
            </section>

            {/* POSITIONING */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-heading text-3xl font-semibold mb-6">
                        A Unified Growth Architecture
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Most marketing fails because it operates in silos. Strategy lives in one room.
                        Creative in another. Sales somewhere else.
                        <br /><br />
                        We eliminate fragmentation by designing cohesive growth systems where brand,
                        technology, content, media, and revenue operations work as one integrated engine.
                    </p>
                </div>
            </section>

            {/* CORE CAPABILITIES GRID */}
            <section className="bg-gray-50 py-24 px-6">
                <div className="max-w-6xl mx-auto">

                    <h2 className="font-heading text-3xl font-semibold text-center mb-16">
                        Core Growth Capabilities
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

                        {/* STRATEGY */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h3 className="font-heading text-xl font-semibold mb-4">
                                Strategic Direction
                            </h3>
                            <p className="text-gray-600 mb-4">
                                We align business objectives with measurable marketing outcomes.
                            </p>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Market intelligence mapping</li>
                                <li>• Positioning refinement</li>
                                <li>• Growth opportunity modeling</li>
                                <li>• Executive-level planning</li>
                            </ul>
                        </div>

                        {/* BRAND */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h3 className="font-heading text-xl font-semibold mb-4">
                                Brand & Experience Design
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Every interaction shapes perception. We design them intentionally.
                            </p>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Brand identity evolution</li>
                                <li>• Messaging frameworks</li>
                                <li>• UX optimization</li>
                                <li>• Visual storytelling systems</li>
                            </ul>
                        </div>

                        {/* DIGITAL */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h3 className="font-heading text-xl font-semibold mb-4">
                                Digital Infrastructure
                            </h3>
                            <p className="text-gray-600 mb-4">
                                High-performance platforms built for conversion.
                            </p>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Custom website architecture</li>
                                <li>• Scalable application systems</li>
                                <li>• eCommerce optimization</li>
                                <li>• Technical performance audits</li>
                            </ul>
                        </div>

                        {/* CONTENT */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h3 className="font-heading text-xl font-semibold mb-4">
                                Authority & Content Systems
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Content engineered for long-term influence.
                            </p>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Editorial architecture</li>
                                <li>• Expert-led content</li>
                                <li>• Multimedia production</li>
                                <li>• Demand-focused distribution</li>
                            </ul>
                        </div>

                        {/* MEDIA */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h3 className="font-heading text-xl font-semibold mb-4">
                                Performance Media
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Precision-targeted campaigns with ROI accountability.
                            </p>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Paid acquisition strategies</li>
                                <li>• Advanced targeting models</li>
                                <li>• Retention & remarketing</li>
                                <li>• Revenue attribution systems</li>
                            </ul>
                        </div>

                        {/* REVENUE */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h3 className="font-heading text-xl font-semibold mb-4">
                                Revenue Enablement
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Closing the gap between marketing and sales.
                            </p>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• CRM ecosystem integration</li>
                                <li>• Automation workflows</li>
                                <li>• Pipeline visibility dashboards</li>
                                <li>• Sales performance alignment</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* PHILOSOPHY SECTION */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-heading text-3xl font-semibold mb-6">
                        Our Philosophy
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        We don’t chase trends.
                        We build sustainable competitive advantages.
                        <br /><br />
                        Our approach combines structured thinking, creative ambition,
                        and data discipline — delivering marketing that performs in the real world.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-indigo-800 text-white py-24 px-6 text-center">
                <h2 className="font-heading text-4xl font-bold mb-6">
                    Let’s Build Your Growth System
                </h2>
                <p className="text-lg opacity-90 mb-10">
                    Ready to replace scattered tactics with strategic clarity?
                </p>

                <Link
                    href="/contact"
                    className="inline-block bg-secondary px-10 py-4 rounded-full font-semibold hover:bg-orange-600 transition shadow-lg"
                >
                    Speak With Our Team
                </Link>
            </section>

        </main>
    );
}
