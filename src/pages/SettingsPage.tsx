import { User, Bell, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/shared/PageHeader';
import { useAuth } from '../contexts/AuthContext';

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Manage your account and preferences" />

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-slate-600" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue={user?.full_name} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue={user?.email} type="email" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input defaultValue={user?.phone || ''} />
          </div>
          <Button size="sm">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-600" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['New lead assigned', 'Meeting reminders', 'Quote signed', 'Payment received', 'Commission approved'].map(
              (item) => (
                <div key={item} className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-700">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                  </label>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-600" />
            <CardTitle className="text-base">Security</CardTitle>
          </div>
          <CardDescription>Password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button size="sm">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
