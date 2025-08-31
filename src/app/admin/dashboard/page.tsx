import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  UtensilsCrossed, 
  ShoppingCart,
  DollarSign,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Orders Today",
      value: "47",
      change: "+12%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-green-500"
    },
    {
      title: "Revenue Today", 
      value: "€634",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-500"
    },
    {
      title: "Menu Items",
      value: "58",
      change: "+3",
      trend: "up",
      icon: UtensilsCrossed,
      color: "text-orange-500"
    },
    {
      title: "Active Orders",
      value: "12",
      change: "Processing",
      trend: "neutral",
      icon: Clock,
      color: "text-gold"
    }
  ];

  const recentOrders = [
    { id: "#001", customer: "Marco Rossi", items: "2x Margherita, 1x Kebab", total: "€18.50", status: "Preparing", time: "10 min ago" },
    { id: "#002", customer: "Sarah Johnson", items: "1x Quattro Stagioni", total: "€12.00", status: "Ready", time: "15 min ago" },
    { id: "#003", customer: "Giuseppe Verdi", items: "3x Pizza Speciale", total: "€35.00", status: "Delivered", time: "25 min ago" },
    { id: "#004", customer: "Anna Bianchi", items: "2x Calzone, 2x Bibite", total: "€19.00", status: "Preparing", time: "30 min ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Preparing": return "bg-orange-500/10 text-orange-500";
      case "Ready": return "bg-green-500/10 text-green-500";
      case "Delivered": return "bg-blue-500/10 text-blue-500";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-gold/20 to-wine/20 rounded-lg p-6 border border-gold/30">
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Welcome back, Admin! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening at Visconti Pizzeria today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm border-border hover:border-gold/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-muted-foreground'}>
                  {stat.change}
                </span>
                {stat.trend !== 'neutral' && ' from yesterday'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-gold" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-foreground">{order.id}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.customer} • {order.items}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{order.total}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-gold/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center text-gold">
              <UtensilsCrossed className="w-5 h-5 mr-2" />
              Menu Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add, edit, or remove menu items
            </p>
            <div className="text-2xl font-bold text-foreground">58 Items</div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-wine/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center text-wine">
              <TrendingUp className="w-5 h-5 mr-2" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View sales and performance metrics
            </p>
            <div className="text-2xl font-bold text-foreground">+15%</div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border hover:border-blue-500/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-500">
              <Users className="w-5 h-5 mr-2" />
              Customer Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage incoming orders
            </p>
            <div className="text-2xl font-bold text-foreground">12 Active</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}