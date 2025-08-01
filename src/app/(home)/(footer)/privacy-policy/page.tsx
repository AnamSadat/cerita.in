import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-25 px-5 pb-20 container mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="text-zinc-400 hover:text-white">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">
              Privacy Policy
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="justify-center flex mt-10 ">
        <Card className="w-full max-w-3xl p-5 shadow-lg bg-neutral-800/80 border-0">
          <CardHeader>
            <CardTitle className="text-5xl font-bold text-center text-white">
              Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral max-w-none text-sm md:text-base leading-relaxed">
            <p className="text-white/50">
              We value your privacy. This Privacy Policy explains how we
              collect, use, and protect your information when you use our
              platform.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">
              1. Information We Collect
            </h3>
            <p className="text-white/50">
              We may collect personal information such as your name, email
              address, and any other information you voluntarily provide when
              registering, logging in, or using our services.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">
              2. How We Use Your Information
            </h3>
            <p className="text-white/50">
              Your data is used to provide and improve our services, respond to
              inquiries, send updates, and personalize user experience.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">3. Data Protection</h3>
            <p className="text-white/50">
              We implement appropriate security measures to protect your data
              from unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">4. Cookies</h3>
            <p className="text-white/50">
              We may use cookies to enhance user experience. You can choose to
              disable cookies through your browser settings.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">
              5. Third-Party Services
            </h3>
            <p className="text-white/50">
              Our platform may contain links to external sites. We are not
              responsible for the privacy practices or content of those sites.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">
              6. Changes to This Policy
            </h3>
            <p className="text-white/50">
              We reserve the right to update this policy at any time. Changes
              will be posted on this page with an updated revision date.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">7. Contact Us</h3>
            <p className="text-white/50">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at: <strong>anamsadat3@gmail.com</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
