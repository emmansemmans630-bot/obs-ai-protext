import React, { useState } from 'react';
import { 
  BookOpen, 
  Music, 
  Settings, 
  Layout, 
  Monitor, 
  Eye, 
  EyeOff, 
  Search,
  Plus,
  Trash2,
  Check,
  Type,
  Palette,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { AIAssistant } from './AIAssistant';
import { useOverlayState, OverlayLayout, TransitionType } from '@/hooks/useOverlayState';
import { BIBLE_VERSIONS, getScripture } from '@/lib/bible-data';
import { toast } from 'sonner';

export default function Dashboard() {
  const { state, updateState } = useOverlayState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songLyrics, setSongLyrics] = useState('');

  const handleShowScripture = (reference: string) => {
    const scripture = getScripture(reference);
    if (scripture) {
      updateState((prev) => ({
        ...prev,
        isVisible: true,
        content: {
          type: 'scripture',
          title: reference,
          text: scripture.text,
          reference: reference,
        },
      }));
      toast.success(`Displaying ${reference}`);
    } else {
      toast.error('Scripture not found in library');
    }
  };

  const handleShowSong = () => {
    if (!songLyrics) return;
    updateState((prev) => ({
      ...prev,
      isVisible: true,
      content: {
        type: 'song',
        title: songTitle,
        text: songLyrics,
      },
    }));
    toast.success(`Displaying song: ${songTitle}`);
  };

  const handleToggleVisibility = () => {
    updateState((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const handleClear = () => {
    updateState((prev) => ({ ...prev, isVisible: false, content: null }));
  };

  const handleUpdateSettings = (key: string, value: any) => {
    updateState((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }));
  };

  return (
    <div className="flex h-screen bg-[#f0f4f8] text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#003366] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">OBS Overlay</h1>
            <p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold">Pro Suite</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <AIAssistant 
            onTranscript={(text) => {
              if (text.trim()) {
                updateState((prev) => ({
                  ...prev,
                  isVisible: true,
                  content: {
                    type: 'caption',
                    text: text,
                  },
                }));
              }
            }}
            onCommand={(cmd, params) => {
              if (cmd === 'SHOW_SCRIPTURE') handleShowScripture(params.reference);
              if (cmd === 'HIDE_OVERLAY') handleClear();
            }}
          />
          
          <div className="mt-8 space-y-1">
             <div className="px-3 py-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">Quick Actions</div>
             <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-white hover:bg-white/10" 
                onClick={handleToggleVisibility}
             >
               {state.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               {state.isVisible ? 'Hide Overlay' : 'Show Overlay'}
             </Button>
             <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-white hover:bg-white/10 text-red-300 hover:text-red-200" 
                onClick={handleClear}
             >
               <Trash2 className="w-4 h-4" />
               Clear Content
             </Button>
          </div>
        </nav>

        <div className="p-4 bg-black/20 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${state.isVisible ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-xs font-medium">{state.isVisible ? 'Overlay Active' : 'Overlay Hidden'}</span>
          </div>
          <Button 
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold" 
            size="sm"
            onClick={() => window.open('/overlay', '_blank')}
          >
            Launch OBS View
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-extrabold text-[#003366]">Dashboard</h2>
              <p className="text-slate-500">Manage your live broadcast overlays</p>
            </div>
          </div>

          <Tabs defaultValue="scripture" className="space-y-6">
            <TabsList className="bg-white p-1 border shadow-sm h-12">
              <TabsTrigger value="scripture" className="data-[state=active]:bg-[#003366] data-[state=active]:text-white h-full px-6 gap-2">
                <BookOpen className="w-4 h-4" /> Scripture
              </TabsTrigger>
              <TabsTrigger value="song" className="data-[state=active]:bg-[#003366] data-[state=active]:text-white h-full px-6 gap-2">
                <Music className="w-4 h-4" /> Songs
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-[#003366] data-[state=active]:text-white h-full px-6 gap-2">
                <Settings className="w-4 h-4" /> Customization
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scripture">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#003366] to-[#006633] text-white">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-400" />
                    Scripture Library
                  </CardTitle>
                  <CardDescription className="text-blue-100">Search and display bible verses instantly</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Version</Label>
                      <Select defaultValue="kjv">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Bible Version" />
                        </SelectTrigger>
                        <SelectContent>
                          {BIBLE_VERSIONS.map((v) => (
                            <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Search Verse</Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="e.g. John 3:16" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button className="bg-[#003366]" onClick={() => handleShowScripture(searchQuery)}>
                          Display
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {['John 3:16', 'Genesis 1:1', 'Psalm 23:1', 'Philippians 4:13', 'Romans 8:28'].map((ref) => (
                      <Button 
                        key={ref} 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col items-start gap-1 text-left border-dashed border-2 border-slate-200 hover:border-[#003366] transition-all"
                        onClick={() => handleShowScripture(ref)}
                      >
                        <span className="font-bold text-[#003366]">{ref}</span>
                        <span className="text-xs text-slate-500 truncate w-full">Click to show on screen</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="song">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#003366] to-[#006633] text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-green-400" />
                    Lyric Management
                  </CardTitle>
                  <CardDescription className="text-blue-100">Write or paste lyrics for the congregation</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Song Title</Label>
                      <Input 
                        placeholder="e.g. Amazing Grace" 
                        value={songTitle}
                        onChange={(e) => setSongTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lyrics / Caption Text</Label>
                      <textarea 
                        className="w-full min-h-[150px] p-4 rounded-lg border focus:ring-2 focus:ring-[#003366] outline-none font-serif text-lg"
                        placeholder="Enter lyrics here..."
                        value={songLyrics}
                        onChange={(e) => setSongLyrics(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => { setSongTitle(''); setSongLyrics(''); }}>Clear Form</Button>
                      <Button className="bg-green-600 hover:bg-green-500" onClick={handleShowSong}>Display Lyrics</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layout className="w-5 h-5 text-green-600" />
                      Display Layout
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant={state.settings.layout === 'lower-third' ? 'default' : 'outline'}
                        className={`h-24 flex flex-col gap-2 ${state.settings.layout === 'lower-third' ? 'bg-[#003366]' : ''}`}
                        onClick={() => handleUpdateSettings('layout', 'lower-third')}
                      >
                        <div className="w-full h-4 bg-slate-200 rounded-sm mt-auto mb-1 flex items-center px-1 overflow-hidden">
                          <div className="w-1/2 h-1 bg-current opacity-50 rounded-full" />
                        </div>
                        Lower Third
                      </Button>
                      <Button 
                        variant={state.settings.layout === 'full-screen' ? 'default' : 'outline'}
                        className={`h-24 flex flex-col gap-2 ${state.settings.layout === 'full-screen' ? 'bg-[#003366]' : ''}`}
                        onClick={() => handleUpdateSettings('layout', 'full-screen')}
                      >
                        <div className="w-full flex-1 bg-slate-200 rounded-sm flex items-center justify-center">
                          <div className="w-3/4 h-2 bg-current opacity-50 rounded-full" />
                        </div>
                        Full Screen
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Font Size</Label>
                          <span className="text-xs font-bold text-[#003366]">{state.settings.fontSize}px</span>
                        </div>
                        <Slider 
                          value={[state.settings.fontSize]} 
                          min={12} 
                          max={72} 
                          step={1}
                          onValueChange={([val]) => handleUpdateSettings('fontSize', val)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Transition Style</Label>
                        <Select 
                          value={state.settings.transition}
                          onValueChange={(val) => handleUpdateSettings('transition', val)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="fade">Fade</SelectItem>
                            <SelectItem value="slide">Slide</SelectItem>
                            <SelectItem value="zoom">Zoom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Palette className="w-5 h-5 text-green-600" />
                      Color Palette
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            className="h-10 w-12 p-1" 
                            value={state.settings.primaryColor}
                            onChange={(e) => handleUpdateSettings('primaryColor', e.target.value)}
                          />
                          <Input 
                            value={state.settings.primaryColor} 
                            onChange={(e) => handleUpdateSettings('primaryColor', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <div className="flex gap-2">
                          <Input 
                            type="color" 
                            className="h-10 w-12 p-1" 
                            value={state.settings.secondaryColor}
                            onChange={(e) => handleUpdateSettings('secondaryColor', e.target.value)}
                          />
                          <Input 
                            value={state.settings.secondaryColor} 
                            onChange={(e) => handleUpdateSettings('secondaryColor', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="color" 
                          className="h-10 w-12 p-1" 
                          value={state.settings.textColor}
                          onChange={(e) => handleUpdateSettings('textColor', e.target.value)}
                        />
                        <Input 
                          value={state.settings.textColor} 
                          onChange={(e) => handleUpdateSettings('textColor', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <Label className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Background Transparency
                      </Label>
                      <Slider 
                        value={[state.settings.opacity * 100]} 
                        min={0} 
                        max={100} 
                        step={1}
                        onValueChange={([val]) => handleUpdateSettings('opacity', val / 100)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
