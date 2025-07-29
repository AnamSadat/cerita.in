import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermCondition() {
  return (
    <div className="min-h-screen pt-28 px-4 md:px-8 container mx-auto flex justify-center">
      <Card className="w-full max-w-3xl shadow-lg bg-neutral-800/80 border-0">
        <CardHeader>
          <CardTitle className="text-3xl">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-neutral max-w-none text-sm md:text-base leading-relaxed">
          <p>
            By accessing and using our platform, you agree to comply with the
            following terms and conditions. Please read them carefully.
          </p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By creating an account or using our services, you agree to be bound
            by these Terms and Conditions. If you do not agree, please do not
            use the platform.
          </p>

          <h3>2. User Responsibilities</h3>
          <p>
            You agree to provide accurate and current information when creating
            an account and to keep your login credentials secure. You are
            responsible for all activities under your account.
          </p>

          <h3>3. Intellectual Property</h3>
          <p>
            All content, trademarks, and intellectual property on this platform
            are owned by us or licensed to us. You may not reproduce or
            redistribute content without permission.
          </p>

          <h3>4. Prohibited Activities</h3>
          <p>
            You may not use the platform for unlawful purposes, harass others,
            spread malicious content, or attempt unauthorized access to systems.
          </p>

          <h3>5. Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account if you
            violate these terms or engage in suspicious or harmful behavior.
          </p>

          <h3>6. Modifications</h3>
          <p>
            We may update these Terms at any time. Continued use of the platform
            after changes constitutes your acceptance of the revised terms.
          </p>

          <h3>7. Contact</h3>
          <p>
            For any questions regarding these Terms and Conditions, please
            contact us at: <strong>support@example.com</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
