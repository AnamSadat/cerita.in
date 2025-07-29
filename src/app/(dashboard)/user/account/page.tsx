'use client';

export default function AccountPage() {
  return (
    <div className="max-w-2xl mx-auto mt-24 px-4">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Akun ⚙️</h1>

      <div className="space-y-6">
        {/* Username */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Username
          </label>
          <p className="text-base font-semibold">@anamsadat</p>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Email
          </label>
          <p className="text-base font-semibold">anam@example.com</p>
        </div>

        {/* Role (opsional) */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Role
          </label>
          <p className="text-base font-semibold">User</p>
        </div>

        {/* Tanggal Bergabung */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Bergabung sejak
          </label>
          <p className="text-base font-semibold">Januari 2024</p>
        </div>
      </div>
    </div>
  );
}
