import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 text-2xl font-bold text-gray-900">LinguaLab</div>
            <p className="text-gray-600">Professional language learning platform for serious learners</p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Pages</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-600 hover:text-gray-900">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Skills</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tets/listening" className="text-gray-600 hover:text-gray-900">
                  Listening
                </Link>
              </li>
              <li>
                <Link href="/test/reading" className="text-gray-600 hover:text-gray-900">
                  Reading
                </Link>
              </li>
              <li>
                <Link href="/test/writing" className="text-gray-600 hover:text-gray-900">
                  Writing
                </Link>
              </li>
              <li>
                <Link href="/test/speaking" className="text-gray-600 hover:text-gray-900">
                  Speaking
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-gray-600">© 2025 Enwis. All rights reserved.</div>
      </div>
    </footer>
  )
}
