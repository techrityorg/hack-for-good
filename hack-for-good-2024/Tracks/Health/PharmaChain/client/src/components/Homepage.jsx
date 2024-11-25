import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Truck, Search, Users, Building2, Syringe, Code, Lightbulb } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="absolute top-0 left-0 right-0 z-10 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">CipherCraft Hackathon</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#about" className="text-white hover:text-cyan-400 transition-colors">About</a></li>
              <li><a href="#features" className="text-white hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#track" className="text-white hover:text-cyan-400 transition-colors">Track a Medicine</a></li>
              <li><a href="#team" className="text-white hover:text-cyan-400 transition-colors">Our Team</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative h-screen flex items-center justify-center">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Pharmaceutical supply chain"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative z-10 text-center text-white">
            <h2 className="text-5xl font-bold mb-6 text-cyan-400">Pharmaceutical Supply Chain with Blockchain</h2>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">Revolutionizing pharmaceutical logistics through secure, transparent, and efficient blockchain solutions</p>
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white text-lg px-8 py-3">View Project</Button>
          </div>
        </section>

        <section id="about" className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12 text-cyan-400">About Our Project</h3>
            <p className="text-center max-w-2xl mx-auto mb-8 text-lg">
              Our CipherCraft Hackathon project tackles the challenges in pharmaceutical supply chains using blockchain technology. 
              We're creating a prototype that demonstrates how blockchain can enhance security, traceability, and efficiency in the distribution of medicines.
            </p>
            <div className="flex justify-center space-x-12">
              <div className="flex items-center">
                <Code className="w-8 h-8 mr-3 text-cyan-400" />
                <span className="text-lg">Blockchain-powered</span>
              </div>
              <div className="flex items-center">
                <Lightbulb className="w-8 h-8 mr-3 text-cyan-400" />
                <span className="text-lg">Innovative Solution</span>
              </div>
              <div className="flex items-center">
                <Users className="w-8 h-8 mr-3 text-cyan-400" />
                <span className="text-lg">Hackathon Project</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-slate-800 text-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12 text-cyan-400">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ShieldCheck className="w-12 h-12 mb-4 text-cyan-400" />}
                title="Enhanced Security"
                description="Implement cryptographic security to ensure data integrity throughout the supply chain."
              />
              <FeatureCard
                icon={<Search className="w-12 h-12 mb-4 text-cyan-400" />}
                title="Complete Traceability"
                description="Develop a system to track pharmaceuticals from manufacture to patient, reducing counterfeits."
              />
              <FeatureCard
                icon={<Truck className="w-12 h-12 mb-4 text-cyan-400" />}
                title="Optimized Logistics"
                description="Create smart contracts to streamline operations and reduce delays in the supply chain."
              />
            </div>
          </div>
        </section>

        <section id="track" className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-8 text-cyan-400">Track a Medicine</h3>
            <p className="text-xl mb-8">Enter the unique identifier of the medicine to track its journey through the supply chain.</p>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter medicine ID"
                className="w-full px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-slate-700 text-white"
              />
              <Button className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white">Track Medicine</Button>
            </div>
          </div>
        </section>

        <section id="team" className="py-20 bg-slate-800 text-white">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12 text-cyan-400">Our Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <TeamMember name="Alice" role="Blockchain Developer" />
              <TeamMember name="Bob" role="Smart Contract Specialist" />
              <TeamMember name="Charlie" role="UI/UX Designer" />
              <TeamMember name="Diana" role="Project Manager" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-4 text-cyan-400">Join Us at CipherCraft Hackathon</h3>
            <p className="text-xl mb-8">Watch our project presentation and see how we're revolutionizing pharmaceutical supply chains!</p>
            <Button variant="outline" size="lg" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 text-lg px-8 py-3">
              Hackathon Schedule
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-8 border-t border-slate-700 text-white">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2023 CipherCraft Hackathon - Pharmaceutical Supply Chain with Blockchain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardHeader className="text-center">
        {icon}
        <CardTitle className="text-cyan-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300">{description}</p>
      </CardContent>
    </Card>
  )
}

function TeamMember({ name, role }) {
  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardContent className="text-center pt-6">
        <div className="w-24 h-24 bg-slate-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Users className="w-12 h-12 text-cyan-400" />
        </div>
        <h4 className="font-bold text-lg mb-1 text-white">{name}</h4>
        <p className="text-slate-400">{role}</p>
      </CardContent>
    </Card>
  )
}