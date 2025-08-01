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

export default function TermCondition() {
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
              Term and Conditions
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="justify-center flex mt-10 ">
        <Card className="w-full max-w-3xl p-5 shadow-lg bg-neutral-800/80 border-0">
          <CardHeader>
            <CardTitle className="text-5xl font-bold text-center text-white">
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral max-w-none  text-sm md:text-base leading-relaxed">
            <p className="text-white/50">
              By accessing and using our platform, you agree to comply with the
              following terms and conditions. Please read them carefully.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">
              1. Acceptance of Terms
            </h3>
            <p className="text-white/50">
              By creating an account or using our services, you agree to be
              bound by these Terms and Conditions. If you do not agree, please
              do not use the platform.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">
              2. User Responsibilities
            </h3>
            <p className="text-white/50">
              You agree to provide accurate and current information when
              creating an account and to keep your login credentials secure. You
              are responsible for all activities under your account.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">
              3. Intellectual Property
            </h3>
            <p className="text-white/50">
              All content, trademarks, and intellectual property on this
              platform are owned by us or licensed to us. You may not reproduce
              or redistribute content without permission.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">
              4. Prohibited Activities
            </h3>
            <p className="text-white/50">
              You may not use the platform for unlawful purposes, harass others,
              spread malicious content, or attempt unauthorized access to
              systems.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">5. Termination</h3>
            <p className="text-white/50">
              We reserve the right to suspend or terminate your account if you
              violate these terms or engage in suspicious or harmful behavior.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">6. Modifications</h3>
            <p className="text-white/50">
              We may update these Terms at any time. Continued use of the
              platform after changes constitutes your acceptance of the revised
              terms.
            </p>

            <h3 className="text-white/50 mt-3 font-bold">7. Contact</h3>
            <p className="text-white/50">
              For any questions regarding these Terms and Conditions, please
              contact us at:{' '}
              <strong>
                <Link
                  href={'mailto:anamsadat@gmail.com'}
                  className="underline underline-offset-1"
                >
                  anamsadat3@gmail.com
                </Link>
              </strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
