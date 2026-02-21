import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings,
  Users,
  CreditCard,
  Key,
  Loader2,
} from 'lucide-react'
import {
  SectionEmptyState,
  SectionErrorState,
  SectionSkeleton,
} from '@/components/profile'
import {
  useProfileTeam,
  useProfileBilling,
  useProfileApiKeys,
  getApiErrorMessage,
} from '@/hooks/use-profile-data'

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isProfileSaving, setIsProfileSaving] = useState(false)

  const teamQuery = useProfileTeam()
  const billingQuery = useProfileBilling()
  const apiKeysQuery = useProfileApiKeys()

  const handleSaveProfile = () => {
    setIsProfileSaving(true)
    setTimeout(() => setIsProfileSaving(false), 800)
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header>
        <h1 className="text-h1 font-bold">Profile</h1>
        <p className="text-body text-muted-foreground mt-1">
          Manage your user and company profile
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList
          className="grid w-full grid-cols-2 sm:grid-cols-5 gap-2 p-1 h-auto rounded-lg"
          aria-label="Profile section navigation"
        >
          <TabsTrigger value="profile" className="py-2 rounded-md">
            Profile
          </TabsTrigger>
          <TabsTrigger value="company" className="py-2 rounded-md">
            Company
          </TabsTrigger>
          <TabsTrigger value="team" className="py-2 rounded-md">
            Team
          </TabsTrigger>
          <TabsTrigger value="billing" className="py-2 rounded-md">
            Billing
          </TabsTrigger>
          <TabsTrigger value="api" className="py-2 rounded-md">
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-h2 font-semibold leading-none tracking-tight">
                Profile Card
              </h2>
              <CardDescription>Name, email, avatar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt="Profile avatar" />
                  <AvatarFallback aria-hidden>U</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" aria-label="Upload avatar">
                  Upload avatar
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" aria-describedby="name-description" />
                <span id="name-description" className="sr-only">Your display name</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" aria-describedby="email-description" />
                <span id="email-description" className="sr-only">Your email address</span>
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={isProfileSaving}
                aria-busy={isProfileSaving}
                className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isProfileSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />
                    Saving…
                  </>
                ) : (
                  'Save changes'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <h2 className="text-h2 font-semibold leading-none tracking-tight">
                Company Settings
              </h2>
              <CardDescription>Name, logo, branded domain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-body text-muted-foreground">
                Manage global settings, brand configuration, and default behaviors.
              </p>
              <Button asChild variant="outline" className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
                <Link to="/dashboard/settings-/-preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" aria-hidden />
                  Open Settings & Preferences
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <h2 className="text-h2 font-semibold leading-none tracking-tight">
                Team Management
              </h2>
              <CardDescription>Invite, roles, seat usage</CardDescription>
            </CardHeader>
            <CardContent>
              {teamQuery.isLoading && <SectionSkeleton rows={4} />}
              {teamQuery.isError && (
                <SectionErrorState
                  message={getApiErrorMessage(teamQuery.error)}
                  onRetry={() => teamQuery.refetch()}
                  isRetrying={teamQuery.isRefetching}
                />
              )}
              {!teamQuery.isLoading && !teamQuery.isError && teamQuery.data?.length === 0 && (
                <SectionEmptyState
                  icon={Users}
                  heading="No team members yet"
                  description="Invite colleagues to collaborate on projects and share approval workflows."
                  action={{
                    label: 'Invite team member',
                    onClick: () => {},
                  }}
                />
              )}
              {!teamQuery.isLoading && !teamQuery.isError && (teamQuery.data?.length ?? 0) > 0 && (
                <div className="space-y-4">
                  {teamQuery.data?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-shadow hover:shadow-card"
                    >
                      <div>
                        <p className="font-medium text-foreground">{member.email}</p>
                        <p className="text-caption text-muted-foreground">{member.role}</p>
                      </div>
                      <span className="text-caption text-muted-foreground">{member.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <h2 className="text-h2 font-semibold leading-none tracking-tight">
                Billing & Subscription
              </h2>
              <CardDescription>Plan, invoices, payment method</CardDescription>
            </CardHeader>
            <CardContent>
              {billingQuery.isLoading && <SectionSkeleton rows={4} />}
              {billingQuery.isError && (
                <SectionErrorState
                  message={getApiErrorMessage(billingQuery.error)}
                  onRetry={() => billingQuery.refetch()}
                  isRetrying={billingQuery.isRefetching}
                />
              )}
              {!billingQuery.isLoading && !billingQuery.isError && !billingQuery.data && (
                <SectionEmptyState
                  icon={CreditCard}
                  heading="No billing setup"
                  description="Add a payment method and choose a plan to unlock team features and higher limits."
                  action={{
                    label: 'View plans',
                    to: '/pricing',
                  }}
                />
              )}
              {!billingQuery.isLoading && !billingQuery.isError && billingQuery.data && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">Current plan</p>
                      <p className="text-caption text-muted-foreground">{billingQuery.data.plan}</p>
                    </div>
                    <span className="text-caption text-muted-foreground">{billingQuery.data.status}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <h2 className="text-h2 font-semibold leading-none tracking-tight">
                API Keys & Webhooks
              </h2>
              <CardDescription>CRUD keys, logs, regenerate</CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeysQuery.isLoading && <SectionSkeleton rows={4} />}
              {apiKeysQuery.isError && (
                <SectionErrorState
                  message={getApiErrorMessage(apiKeysQuery.error)}
                  onRetry={() => apiKeysQuery.refetch()}
                  isRetrying={apiKeysQuery.isRefetching}
                />
              )}
              {!apiKeysQuery.isLoading && !apiKeysQuery.isError && apiKeysQuery.data?.length === 0 && (
                <SectionEmptyState
                  icon={Key}
                  heading="No API keys yet"
                  description="Create an API key to integrate Archject with your tools and automate approval workflows."
                  action={{
                    label: 'Create API key',
                    onClick: () => {},
                  }}
                />
              )}
              {!apiKeysQuery.isLoading && !apiKeysQuery.isError && (apiKeysQuery.data?.length ?? 0) > 0 && (
                <div className="space-y-4">
                  {apiKeysQuery.data?.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-shadow hover:shadow-card"
                    >
                      <div>
                        <p className="font-medium text-foreground">{key.name}</p>
                        {key.lastUsed && (
                          <p className="text-caption text-muted-foreground">
                            Last used: {key.lastUsed}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
