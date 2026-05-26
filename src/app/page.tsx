import { supabase } from "@/lib/supabase"
import { PublicNavbar } from "@/components/public/public-navbar"
import { PublicFooter } from "@/components/public/public-footer"
import { HeroSection } from "@/components/public/hero-section"
import { NewsSection } from "@/components/public/news-section"
import { MatchesSection } from "@/components/public/matches-section"
import { CompetitionsStandings } from "@/components/public/competitions-standings"
import { ClubsPlayers } from "@/components/public/clubs-players"
import { ShopPreview } from "@/components/public/shop-preview"
import { TicketsPreview } from "@/components/public/tickets-preview"
import { MediaSponsors } from "@/components/public/media-sponsors"

// Revalidate this page every 60 seconds to keep data fresh without overloading DB
export const revalidate = 60

export default async function Home() {
  // Fetch real data from Supabase for the public homepage sections
  // We use Promise.all to fetch them concurrently for performance
  
  const [
    { data: newsData },
    { data: matchesData },
    { data: competitionsData },
    { data: standingsData },
    { data: clubsData },
    { data: playersData },
    { data: productsData },
    { data: ticketsData }
  ] = await Promise.all([
    // 1. News
    supabase.from('news')
      .select('id, title, excerpt, cover_image, category, published_at, author:users!author_id(full_name)')
      .eq('status', 'Publié')
      .order('published_at', { ascending: false })
      .limit(4),
    
    // 2. Matches
    supabase.from('matches')
      .select('id, match_date, status, home_score, away_score, referee, home_club:clubs!home_club_id(id, name, short, logo_url), away_club:clubs!away_club_id(id, name, short, logo_url), competition:competitions(name)')
      .order('match_date', { ascending: true }) // we'll sort later
      .limit(10),

    // 3. Competitions
    supabase.from('competitions')
      .select('id, name, season, type, logo_url')
      .eq('status', 'En cours')
      .limit(4),

    // 4. Standings (Assuming Ligue 1 Orange is id 1 or similar, we'll fetch top 5)
    supabase.from('standings')
      .select('id, club:clubs(name, short), points, played, goal_difference')
      .order('points', { ascending: false })
      .order('goal_difference', { ascending: false })
      .limit(5),

    // 5. Clubs
    supabase.from('clubs')
      .select('id, name, short, city, logo_url')
      .eq('status', 'Actif')
      .limit(6),

    // 6. Players
    supabase.from('players')
      .select('id, first_name, last_name, position, club:clubs(name, short), photo_url')
      .eq('status', 'Actif')
      .limit(4),

    // 7. Products
    supabase.from('products')
      .select('id, name, price, category, images, stock, reserved')
      .limit(4),

    // 8. Tickets
    supabase.from('tickets')
      .select('id, match_id, category, price, available_quantity, reserved_quantity, status, match:matches(match_date, home_club:clubs!home_club_id(name, short), away_club:clubs!away_club_id(name, short), competition:competitions(name))')
      .eq('status', 'DISPONIBLE')
      .limit(3)
  ])

  // Process data if needed
  const news = newsData || []
  
  // Sort matches to separate upcoming and past, keep 4 of each
  const now = new Date().getTime()
  const allMatches = matchesData || []
  const upcomingMatches = allMatches.filter(m => new Date(m.match_date).getTime() > now).slice(0, 4)
  const pastMatches = allMatches.filter(m => new Date(m.match_date).getTime() <= now).slice(0, 4)
  const displayMatches = [...upcomingMatches, ...pastMatches]

  const competitions = competitionsData || []
  const standings = standingsData || []
  const clubs = clubsData || []
  const players = playersData || []
  const products = productsData || []
  const tickets = ticketsData || []

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-green-500/30 selection:text-green-200">
      <PublicNavbar />
      
      <main>
        <HeroSection />
        
        <NewsSection news={news as any} />
        
        <MatchesSection matches={displayMatches as any} />
        
        <CompetitionsStandings competitions={competitions as any} standings={standings as any} />
        
        <ClubsPlayers clubs={clubs as any} players={players as any} />
        
        <ShopPreview products={products as any} />
        
        <TicketsPreview tickets={tickets as any} />
        
        <MediaSponsors />
      </main>

      <PublicFooter />
    </div>
  )
}
