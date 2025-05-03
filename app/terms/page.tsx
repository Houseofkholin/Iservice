import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Button variant="ghost" size="sm" asChild className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: March 21, 2025</p>

        <h2>1. Introduction</h2>
        <p>
          Welcome to I-service ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of
          the I-service platform, including any content, functionality, and services offered on or through our website
          (the "Service").
        </p>
        <p>
          By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms,
          you must not access or use the Service.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you
          are at least 18 years old and have the legal capacity to enter into these Terms.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          When you create an account with us, you must provide accurate, complete, and current information. You are
          responsible for safeguarding your account credentials and for any activity that occurs under your account.
        </p>
        <p>
          You agree to notify us immediately of any unauthorized access to or use of your account. We reserve the right
          to disable your account at any time if we believe you have violated these Terms.
        </p>

        <h2>4. Service Listings and Transactions</h2>
        <p>
          I-service is a platform that connects service providers with clients. We do not guarantee the quality, safety,
          or legality of services offered through our platform.
        </p>
        <p>
          When you list a service or place a bid, you are entering into a direct agreement with the other party. We are
          not a party to these agreements and are not responsible for the actions or inactions of users.
        </p>

        <h2>5. Blockchain and Smart Contracts</h2>
        <p>
          Our platform utilizes blockchain technology and smart contracts for certain functions. You acknowledge that
          blockchain transactions are irreversible and that we cannot recover or reverse any transactions once they are
          confirmed on the blockchain.
        </p>
        <p>
          You are responsible for securing your wallet and private keys. We are not responsible for any loss of funds
          due to lost or compromised private keys.
        </p>

        <h2>6. Fees and Payments</h2>
        <p>
          We charge fees for certain services provided through the platform. These fees are clearly disclosed before you
          complete a transaction.
        </p>
        <p>
          All payments are processed through our escrow system or directly on the blockchain. We are not responsible for
          any payment issues that arise from blockchain network congestion, high gas fees, or other technical issues.
        </p>

        <h2>7. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are owned by I-service and are protected by
          international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>

        <h2>8. Prohibited Uses</h2>
        <p>
          You may not use the Service for any illegal purpose or in violation of any local, state, national, or
          international law. You may not use the Service to transmit any material that is defamatory, obscene, or
          otherwise objectionable.
        </p>

        <h2>9. Termination</h2>
        <p>
          We may terminate or suspend your account and access to the Service immediately, without prior notice or
          liability, for any reason, including if you breach these Terms.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          In no event shall I-service, its directors, employees, partners, agents, suppliers, or affiliates be liable
          for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or
          other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide
          at least 30 days' notice prior to any new terms taking effect.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:support@i-service.com">support@i-service.com</a>.
        </p>
      </div>
    </div>
  )
}

