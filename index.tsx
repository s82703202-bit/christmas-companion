import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FolderHeart } from "lucide-react";

import hero from "@/assets/hero-gifts.jpg";
import { useAuth } from "@/hooks/use-auth";
import { fetchSavedItems } from "@/lib/recent";
import { TOOL_ITEMS } from "@/components/app/nav-items";
import { SavedList } from "@/components/app/SavedList";
import { EmptyState, Panel } from "@/components/app/common";
import { Snowflake } from "@/components/app/Decor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Christmas Companion — Make Christmas magical" },
      { name: "description", content: "Plan a stress-free Christmas: Secret Santa, AI gift ideas, budget planner, kids' activities and festive meal plans in one place." },
      { property: "og:title", content: "The Christmas Companion — Make Christmas magical" },
      { property: "og:description", content: "Five festive tools. One beautiful Christmas experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const CARDS = [
  { ...TOOL_ITEMS[0], title: "Secret Santa Generator", description: "Organize a magical gift exchange with family, friends or colleagues.", cta: "Organize Secret Santa", tone: "bg-gradient-burgundy" },
  { ...TOOL_ITEMS[1], title: "AI Gift Finder", description: "Find thoughtful gift ideas based on someone's age, interests and budget.", cta: "Find the Perfect Gift", tone: "bg-gradient-forest" },
  { ...TOOL_ITEMS[2], title: "Christmas Budget Planner", description: "Plan holiday spending and stay within your Christmas budget.", cta: "Plan My Budget", tone: "bg-gradient-forest" },
  { ...TOOL_ITEMS[3], title: "Kids' Christmas Activities", description: "Create festive games, coloring pages and printable activities for children.", cta: "Create Activities", tone: "bg-gradient-burgundy" },
  { ...TOOL_ITEMS[4], title: "Christmas Meal Planner", description: "Plan your Christmas menu, recipes and shopping list.", cta: "Plan Christmas Meals", tone: "bg-gradient-forest" },
] as const;

function daysUntilChristmas() {
  const now = new Date();
  let xmas = new Date(now.getFullYear(), 11, 25);
  if (now > new Date(now.getFullYear(), 11, 26)) xmas = new Date(now.getFullYear() + 1, 11, 25);
  return Math.max(0, Math.ceil((xmas.getTime() - now.getTime()) / 86_400_000));
}

function Dashboard() {
  const { user, loading } = useAuth();
  const name = (user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0]) as string | undefined;
  const recent = useQuery({
    queryKey: ["saved-items", user?.id, 5],
    queryFn: () => fetchSavedItems(5),
    enabled: !!user,
  });

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-card animate-fade-up">
        <img src={hero} alt="Wrapped Christmas gifts with gold ribbons and pine branches" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/90 to-cream/10 sm:via-cream/80" />
        <div className="relative max-w-xl px-6 py-12 sm:px-10 sm:py-16">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-burgundy">
            <Snowflake className="h-4 w-4 text-gold" />
            {!loading && name ? `Welcome back, ${name}` : "Welcome to The Christmas Companion"}
          </p>
          <h1 className="mt-4 text-4xl leading-[1.05] text-forest sm:text-6xl">
            Make Christmas <em className="text-burgundy">magical.</em>
          </h1>
          <p className="mt-4 text-lg text-foreground/80">
            Everything you need to plan, organize and enjoy a stress-free Christmas.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/secret-santa">Start with Secret Santa <ArrowRight /></Link>
            </Button>
            <span className="rounded-full border border-gold/50 bg-card/80 px-4 py-2 text-sm text-forest">
              🎄 {daysUntilChristmas()} days until Christmas
            </span>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section aria-labelledby="tools-heading">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-burgundy">Five festive tools</p>
            <h2 id="tools-heading" className="mt-1 text-3xl text-forest">Your Christmas toolkit</h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.to}
                to={c.to}
                className="lift group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl ${c.tone} text-gold shadow-soft`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl text-forest">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-burgundy">
                  {c.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent */}
      <section aria-labelledby="recent-heading">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="recent-heading" className="text-2xl text-forest">Recent projects</h2>
            {user && (
              <Button asChild variant="outline" size="sm">
                <Link to="/saved"><FolderHeart /> All saved work</Link>
              </Button>
            )}
          </div>
          {!user || recent.isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
            </div>
          ) : recent.isError ? (
            <p className="text-sm text-destructive">{(recent.error as Error).message}</p>
          ) : recent.data && recent.data.length > 0 ? (
            <SavedList items={recent.data} />
          ) : (
            <EmptyState
              title="Nothing saved yet"
              description="Pick any tool above to get started — everything you save will appear here."
            />
          )}
        </Panel>
      </section>
    </div>
  );
}
