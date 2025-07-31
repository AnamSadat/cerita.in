import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-28 px-4 md:px-8 container mx-auto flex justify-center">
      <Card className="w-full max-w-3xl shadow-lg bg-neutral-800/80 border-0">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-neutral max-w-none text-sm md:text-base leading-relaxed">
          <p>
            We value your privacy. This Privacy Policy explains how we collect,
            use, and protect your information when you use our platform.
          </p>

          <h3>1. Information We Collect</h3>
          <p>
            We may collect personal information such as your name, email
            address, and any other information you voluntarily provide when
            registering, logging in, or using our services.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            Your data is used to provide and improve our services, respond to
            inquiries, send updates, and personalize user experience.
          </p>

          <h3>3. Data Protection</h3>
          <p>
            We implement appropriate security measures to protect your data from
            unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h3>4. Cookies</h3>
          <p>
            We may use cookies to enhance user experience. You can choose to
            disable cookies through your browser settings.
          </p>

          <h3>5. Third-Party Services</h3>
          <p>
            Our platform may contain links to external sites. We are not
            responsible for the privacy practices or content of those sites.
          </p>

          <h3>6. Changes to This Policy</h3>
          <p>
            We reserve the right to update this policy at any time. Changes will
            be posted on this page with an updated revision date.
          </p>

          <h3>7. Contact Us</h3>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at: <strong>support@example.com</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
