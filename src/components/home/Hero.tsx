import Link from "next/link"

const Hero = () => {
  return (
    <>
        <section className="rounded-2-xl bg-gradient-to-r from-blue-600 to-blue-400 p-10 text-white">
            <h1 className="text-4xl font-bold">  Big Shopping Festival </h1>

            <p className="mt-4 text-lg">Up to 70% off on Electronics </p>

            <Link href="/products" className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-600">
                Shop Now
            </Link>

        </section>
    </>
  )
}

export default Hero