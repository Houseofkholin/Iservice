import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Button variant="ghost" size="sm" asChild className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: March 21, 2025</p>

        <h2>1. Introduction</h2>
        <p>
          At I-service, we respect your privacy and are committed to protecting your personal data. This Privacy Policy
          explains how we collect, use, and safeguard your information when you use our platform.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect several types of information from and about users of our platform, including:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> Name, email address, phone number, and other contact details you
            provide when creating an account or updating your profile.
          </li>
          <li>
            <strong>Wallet Information:</strong> Public wallet addresses that you connect to our platform.
          </li>
          <li>
            <strong>Transaction Information:</strong> Details about the services you offer or purchase, bids you place,
            and contracts you enter into.
          </li>
          <li>
            <strong>Usage Information:</strong> Information about how you use our platform, including your browsing
            patterns, search queries, and interactions with other users.
          </li>
          <li>
            <strong>Device Information:</strong> Information about the device you use to access our platform, including
            IP address, browser type, and operating system.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our platform</li>
          <li>Process transactions and send related information</li>
          <li>Verify your identity and prevent fraud</li>
          <li>Communicate with you about your account, services, and updates</li>
          <li>Personalize your experience and deliver content relevant to your interests</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our platform</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. Blockchain Data</h2>
        <p>
          Our platform utilizes blockchain technology, which is inherently transparent. Information stored on the
          blockchain, including wallet addresses and transaction details, is publicly accessible. We do not control and
          cannot remove information once it is recorded on the blockchain.
        </p>

        <h2>5. Sharing Your Information</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>
            <strong>Other Users:</strong> When you offer services or place bids, certain information is shared with the
            relevant users to facilitate transactions.
          </li>
          <li>
            <strong>Service Providers:</strong> We may share your information with third-party vendors who provide
            services on our behalf.
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to
            valid requests by public authorities.
          </li>
        </ul>

        <h2>6. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. However, no method of
          transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
          security.
        </p>

        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul>
          <li>The right to access your personal information</li>
          <li>The right to correct inaccurate or incomplete information</li>
          <li>The right to delete your personal information</li>
          <li>The right to restrict or object to processing of your personal information</li>
          <li>The right to data portability</li>
        </ul>

        <h2>8. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our platform and hold certain
          information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>

        <h2>9. Children's Privacy</h2>
        <p>
          Our platform is not intended for children under 18 years of age. We do not knowingly collect personal
          information from children under 18.
        </p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:privacy@i-service.com">privacy@i-service.com</a>.
        </p>
      </div>
    </div>
  )
}

