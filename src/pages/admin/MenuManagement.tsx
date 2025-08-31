import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Save,
  X
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  available: boolean;
}

const MenuManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Margherita',
      description: 'Pomodoro, mozzarella, basilico',
      price: '€8.50',
      category: 'pizze-tradizionali',
      image: '/api/placeholder/300/200',
      available: true
    },
    {
      id: '2', 
      name: 'Quattro Stagioni',
      description: 'Pomodoro, mozzarella, funghi, prosciutto, carciofi, olive',
      price: '€12.00',
      category: 'pizze-tradizionali',
      image: '/api/placeholder/300/200',
      available: true
    },
    {
      id: '3',
      name: 'Kebab Panino',
      description: 'Carne di kebab, verdure fresche, salsa',
      price: '€6.00',
      category: 'kebab-panini',
      image: '/api/placeholder/300/200',
      available: false
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'pizze-tradizionali', label: '🍕 Pizze Tradizionali' },
    { value: 'pizze-speciali', label: '⭐ Pizze Speciali' },
    { value: 'calzoni', label: '🥟 Calzoni' },
    { value: 'kebab-panini', label: '🥙 Kebab & Panini' },
    { value: 'burgers', label: '🍔 Burgers & Sides' },
    { value: 'bibite', label: '🥤 Bibite' }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'pizze-tradizionali',
    image: '',
    available: true
  });

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // Update existing item
      setMenuItems(items => items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
      setEditingItem(null);
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData
      };
      setMenuItems(items => [...items, newItem]);
    }
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'pizze-tradizionali',
      image: '',
      available: true
    });
    setShowAddForm(false);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      available: item.available
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(items => items.filter(item => item.id !== id));
    }
  };

  const toggleAvailability = (id: string) => {
    setMenuItems(items => items.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant's menu items</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-gold text-black hover:bg-gold-dark"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-background border border-border rounded-md text-sm"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-card/80 backdrop-blur-sm border-gold/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                  setFormData({
                    name: '',
                    description: '',
                    price: '',
                    category: 'pizze-tradizionali',
                    image: '',
                    available: true
                  });
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Item name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="€0.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Item description"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                    required
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({...formData, available: e.target.checked})}
                  className="rounded border-border"
                />
                <Label htmlFor="available">Available for order</Label>
              </div>
              
              <div className="flex gap-3">
                <Button type="submit" className="bg-gold text-black hover:bg-gold-dark">
                  <Save className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-card/80 backdrop-blur-sm border-border overflow-hidden">
            <div className="relative h-48">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200' fill='none'%3E%3Crect width='300' height='200' fill='%23F4F4F5'/%3E%3Cpath d='M150 100L120 80L90 100L120 120L150 100Z' fill='%23E5E5E5'/%3E%3C/svg%3E";
                }}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge className={item.available ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}>
                  {item.available ? 'Available' : 'Unavailable'}
                </Badge>
                <Badge variant="secondary">{item.price}</Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {categories.find(cat => cat.value === item.category)?.label}
                </Badge>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAvailability(item.id)}
                    className="px-2 py-1 h-8"
                  >
                    {item.available ? '🔴' : '🟢'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    className="px-2 py-1 h-8"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="px-2 py-1 h-8 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No menu items found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;