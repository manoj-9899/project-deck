import React, { useState } from "react";
import {
  PageContainer,
  PageHeader,
  SectionWrapper,
  Grid,
  Stack,
  InlineGroup,
  SplitLayout,
  ScrollableArea,
} from "../layout/LayoutPrimitives";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { Checkbox } from "../ui/Checkbox";
import { Switch } from "../ui/Switch";
import { Badge } from "../ui/Badge";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { Avatar } from "../ui/Avatar";
import { Progress } from "../ui/Progress";
import { Tooltip } from "../ui/Tooltip";
import { DropdownMenu } from "../ui/DropdownMenu";
import { Dialog } from "../ui/Dialog";
import { Sheet } from "../ui/Sheet";
import { Tabs, TabItem } from "../ui/Tabs";
import { useToast } from "../ui/Toast";
import { Skeleton } from "../ui/Skeleton";
import { EmptyState } from "../ui/EmptyState";
import { Divider } from "../ui/Divider";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Code2,
  Sliders,
  Sparkles,
  Settings,
  HelpCircle,
  ExternalLink,
  Bot,
  Terminal,
  Activity,
  Layers,
  Layout,
  Shield,
  Bell,
  Trash2,
  FolderKanban,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";

export default function DesignSystemPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dialog & Sheet States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetSide, setSheetSide] = useState<"right" | "left" | "bottom">("right");

  // Interactive Form States
  const [isChecked, setIsChecked] = useState(true);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectVal, setSelectVal] = useState("building");
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("workspace");
  const showcaseTabs: TabItem[] = [
    { id: "workspace", label: "Workspace", icon: <FolderKanban className="w-3.5 h-3.5" /> },
    { id: "decisions", label: "Decisions", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "integrations", label: "Integrations", icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: "settings", label: "Settings", icon: <Sliders className="w-3.5 h-3.5" /> },
  ];

  // Simulated button loader
  const triggerLoading = () => {
    setIsButtonLoading(true);
    setTimeout(() => {
      setIsButtonLoading(false);
      toast({
        type: "success",
        title: "Build Pipeline Simulated",
        message: "Successfully generated production static build bundles.",
      });
    }, 2000);
  };

  return (
    <PageContainer className="animate-fade-in font-sans">
      {/* Page Header */}
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent-primary shrink-0" />
            <span>Design System Showcase</span>
          </div>
        }
        subtitle="Foundational variables, reusable TypeScript controls, and typographic hierarchy for ProjectDock Phase 1."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Root</span>
          </Button>
        }
      />

      <SplitLayout ratio="1:3" gap="lg" className="relative">
        {/* Sidebar Navigation */}
        <div className="hidden lg:flex flex-col gap-1 sticky top-8 h-fit max-h-[85vh] overflow-y-auto pr-3 border-r border-border-subtle/50">
          <p className="text-[10px] font-bold text-text-tertiary tracking-widest uppercase mb-2">Showcase Index</p>
          <a href="#foundations" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Foundations</a>
          <a href="#typography" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Typography</a>
          <a href="#colours" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Design Tokens</a>
          <a href="#buttons" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Buttons & Actions</a>
          <a href="#form-controls" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Form Controls</a>
          <a href="#badges" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Status Badges</a>
          <a href="#cards" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Cards</a>
          <a href="#progress" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Progress Indicators</a>
          <a href="#navigation" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Workspace Tabs</a>
          <a href="#overlays" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Overlays & Sheets</a>
          <a href="#feedback" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Toast Feedback</a>
          <a href="#loading-states" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Loading Skeletons</a>
          <a href="#empty-states" className="px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary rounded-md hover:bg-muted-surface transition-colors">Empty States</a>
        </div>

        {/* Core Showcase Modules */}
        <Stack gap="xl">
          {/* Section: Foundations */}
          <SectionWrapper
            id="foundations"
            title="01 / Core Philosophy & Foundations"
            description="Our aesthetic couples the clarity of premium productivity workspaces with the meticulous precision of developer interfaces."
          >
            <Grid cols={3} gap="md">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent-primary" />
                    <h3 className="text-sm font-semibold text-text-primary">Meticulous Control</h3>
                  </div>
                </CardHeader>
                <CardBody className="text-xs text-text-secondary leading-relaxed">
                  Off-white page environments, crisp containers, and explicit borders deliver visual structure without the visual fatigue of dark workspaces or flat SaaS tables.
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-accent-primary" />
                    <h3 className="text-sm font-semibold text-text-primary">Technical Precision</h3>
                  </div>
                </CardHeader>
                <CardBody className="text-xs text-text-secondary leading-relaxed">
                  Monospace metadata, explicit hotkeys, and small helper chips reflect developer-centric environments and clean layout hierarchies.
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-primary" />
                    <h3 className="text-sm font-semibold text-text-primary">Craftsmanship</h3>
                  </div>
                </CardHeader>
                <CardBody className="text-xs text-text-secondary leading-relaxed">
                  Deliberate micro-animations, proportional radius tokens, and soft high-contrast values offer responsive click/hover states designed for speed.
                </CardBody>
              </Card>
            </Grid>
          </SectionWrapper>

          {/* Section: Typography */}
          <SectionWrapper
            id="typography"
            title="02 / Typography Scale"
            description="Our system relies on Inter for clean interfaces, paired with JetBrains Mono for metadata and Space Grotesk for Display Headings."
          >
            <Card>
              <CardBody className="flex flex-col gap-5">
                <div className="flex flex-col gap-1 pb-4 border-b border-border-subtle">
                  <span className="font-mono text-[10px] text-text-tertiary">Display Heading - Space Grotesk / Bold</span>
                  <h1 className="font-display text-4xl font-bold text-text-primary tracking-tight">ProjectDock Pro</h1>
                </div>

                <div className="flex flex-col gap-1 pb-4 border-b border-border-subtle">
                  <span className="font-mono text-[10px] text-text-tertiary">Page Title - Inter / Bold</span>
                  <h2 className="text-2xl font-bold text-text-primary tracking-tight">Phase 1: Foundation Completed</h2>
                </div>

                <div className="flex flex-col gap-1 pb-4 border-b border-border-subtle">
                  <span className="font-mono text-[10px] text-text-tertiary">Section Title - Inter / Semibold</span>
                  <h3 className="text-lg font-semibold text-text-primary tracking-tight">DevHabits Active Metrics</h3>
                </div>

                <div className="flex flex-col gap-1 pb-4 border-b border-border-subtle">
                  <span className="font-mono text-[10px] text-text-tertiary">Card Title - Inter / Medium</span>
                  <h4 className="text-sm font-semibold text-text-primary">LaunchKaro Deploy Log</h4>
                </div>

                <div className="flex flex-col gap-1 pb-4 border-b border-border-subtle">
                  <span className="font-mono text-[10px] text-text-tertiary">Body text - Inter / Regular</span>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    A personal engineering workspace for planning, building, documenting, and shipping every project from one place. Integrate code reviews, checklist states, and critical paths.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-text-tertiary">Code/Metadata - JetBrains Mono / Medium</span>
                  <p className="font-mono text-xs text-accent-primary bg-accent-soft px-2 py-1.5 rounded-sm border border-accent-primary/10 w-fit">
                    `src/components/ui/Button.tsx` (phase_1_milestone_completed)
                  </p>
                </div>
              </CardBody>
            </Card>
          </SectionWrapper>

          {/* Section: Colours */}
          <SectionWrapper
            id="colours"
            title="03 / Design Tokens & Palette"
            description="Explicitly declared variables in src/index.css drive color, radius, and shadows consistently."
          >
            <Grid cols={3} gap="md">
              {/* Color Block: Theme */}
              <div className="flex flex-col gap-2">
                <div className="h-16 w-full rounded-lg bg-page-bg border border-border-strong flex items-end p-2.5">
                  <span className="text-[11px] font-mono font-medium text-text-secondary">bg-page-bg (#fdfdfc)</span>
                </div>
                <p className="text-xs font-semibold text-text-primary">Page Background</p>
                <p className="text-[11px] text-text-tertiary">Warm off-white for low fatigue.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-16 w-full rounded-lg bg-surface border border-border-strong flex items-end p-2.5 shadow-subtle">
                  <span className="text-[11px] font-mono font-medium text-text-primary">bg-surface (#ffffff)</span>
                </div>
                <p className="text-xs font-semibold text-text-primary">Surface Container</p>
                <p className="text-[11px] text-text-tertiary">Crisp white elevated surfaces.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-16 w-full rounded-lg bg-muted-surface border border-border-strong flex items-end p-2.5">
                  <span className="text-[11px] font-mono font-medium text-text-secondary">bg-muted-surface (#f9f8f6)</span>
                </div>
                <p className="text-xs font-semibold text-text-primary">Muted Panel</p>
                <p className="text-[11px] text-text-tertiary">Perfect for footers and rails.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-16 w-full rounded-lg bg-accent-primary border border-accent-primary flex items-end p-2.5 text-white">
                  <span className="text-[11px] font-mono font-medium">bg-accent-primary (#5f5af6)</span>
                </div>
                <p className="text-xs font-semibold text-text-primary">Indigo Accent</p>
                <p className="text-[11px] text-text-tertiary">Primary focus action trigger.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-16 w-full rounded-lg bg-border-strong flex items-end p-2.5 text-text-primary">
                  <span className="text-[11px] font-mono font-medium">border-strong (#d3cfc9)</span>
                </div>
                <p className="text-xs font-semibold text-text-primary">Standard Border</p>
                <p className="text-[11px] text-text-tertiary">Explicit divider line weight.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-16 w-full rounded-lg bg-accent-soft border border-accent-primary/20 flex items-end p-2.5 text-accent-primary">
                  <span className="text-[11px] font-mono font-medium">bg-accent-soft (#f4f3ff)</span>
                </div>
                <p className="text-xs font-semibold text-text-primary">Accent Soft Highlight</p>
                <p className="text-[11px] text-text-tertiary">Soft highlights for active status.</p>
              </div>
            </Grid>

            {/* Radius & Shadow showcase */}
            <div className="mt-6 p-4 bg-muted-surface rounded-lg border border-border-strong flex flex-wrap gap-5">
              <div className="flex-1 min-w-[150px] flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Shadow Scale</span>
                <div className="flex gap-2">
                  <div className="bg-surface shadow-subtle border border-border-subtle p-2 text-[10px] rounded flex-1 text-center text-text-secondary font-mono">shadow-subtle</div>
                  <div className="bg-surface shadow-elevated border border-border-subtle p-2 text-[10px] rounded flex-1 text-center text-text-secondary font-mono">shadow-elevated</div>
                </div>
              </div>

              <div className="flex-1 min-w-[150px] flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Radius System</span>
                <div className="flex gap-2">
                  <div className="bg-surface border border-border-strong rounded-xs p-2 text-[10px] flex-1 text-center text-text-secondary font-mono">rounded-xs (2px)</div>
                  <div className="bg-surface border border-border-strong rounded-md p-2 text-[10px] flex-1 text-center text-text-secondary font-mono">rounded-md (6px)</div>
                </div>
              </div>
            </div>
          </SectionWrapper>

          {/* Section: Buttons */}
          <SectionWrapper
            id="buttons"
            title="04 / Buttons & Actions"
            description="Buttons support hover scaling, keyboard focus outlines, explicit sizes, and spinner integrations."
          >
            <Card>
              <CardBody className="flex flex-col gap-6">
                {/* Variant rows */}
                <div className="flex flex-col gap-2.5">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Button Variants</p>
                  <InlineGroup gap="md">
                    <Button variant="primary">Primary Action</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost Trigger</Button>
                    <Button variant="destructive">Delete Item</Button>
                  </InlineGroup>
                </div>

                {/* Sizes */}
                <div className="flex flex-col gap-2.5">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Button Sizes</p>
                  <InlineGroup gap="md" align="center">
                    <Button variant="primary" size="sm">Small Control</Button>
                    <Button variant="primary" size="md">Medium standard</Button>
                    <Button variant="primary" size="lg">Large Hero</Button>
                  </InlineGroup>
                </div>

                {/* States */}
                <div className="flex flex-col gap-2.5">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">States & Interactions</p>
                  <InlineGroup gap="md">
                    <Button variant="primary" disabled>Disabled State</Button>
                    <Button variant="secondary" isLoading>Running Tests</Button>
                    <Button variant="primary" isLoading={isButtonLoading} onClick={triggerLoading}>
                      {isButtonLoading ? "Compiling..." : "Simulate Build Compilation"}
                    </Button>
                  </InlineGroup>
                </div>

                {/* Icon Button */}
                <div className="flex flex-col gap-2.5">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Icon Buttons (with tooltips)</p>
                  <InlineGroup gap="md">
                    <Tooltip content="Open settings panel">
                      <IconButton icon={<Settings className="w-4 h-4" />} label="Configure Application Workspace" variant="secondary" />
                    </Tooltip>
                    <Tooltip content="Integrate with external API">
                      <IconButton icon={<Code2 className="w-4 h-4" />} label="Connect GitHub Repository" variant="primary" />
                    </Tooltip>
                    <Tooltip content="Purge build logs">
                      <IconButton icon={<Trash2 className="w-4 h-4" />} label="Delete temporary build state" variant="destructive" />
                    </Tooltip>
                  </InlineGroup>
                </div>
              </CardBody>
            </Card>
          </SectionWrapper>

          {/* Section: Form Controls */}
          <SectionWrapper
            id="form-controls"
            title="05 / Form Controls & Text Entry"
            description="Inputs, selectors, and check triggers leverage matching borders, crisp labels, and error chips."
          >
            <Card>
              <CardBody className="flex flex-col gap-6">
                <Grid cols={2} gap="md">
                  {/* Left Column inputs */}
                  <Stack gap="md">
                    <Input
                      label="Workspace Slug"
                      placeholder="e.g. projectdock-phase-1"
                      helperText="This matches the folder path in your dev environment."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />

                    <Input
                      label="VCS Deploy Token"
                      placeholder="Input VCS credentials..."
                      leadingIcon={<Shield className="w-4 h-4" />}
                      type="password"
                    />

                    <Input
                      label="Repository URL"
                      placeholder="github.com/projectdock/dock-system"
                      error={inputText.length > 25 ? "Path length is too long for standard indexer mapping" : undefined}
                      helperText="Max 25 characters to prevent warnings."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                  </Stack>

                  {/* Right Column Textarea / Selector */}
                  <Stack gap="md">
                    <Select
                      label="Project Status Level"
                      options={[
                        { value: "building", label: "Building (Active Phase 1)" },
                        { value: "testing", label: "Testing (Simulated Pipeline)" },
                        { value: "deployed", label: "Deployed (Cloud Native)" },
                        { value: "paused", label: "Paused" },
                        { value: "blocked", label: "Blocked" },
                      ]}
                      value={selectVal}
                      onChange={(e) => {
                        setSelectVal(e.target.value);
                        toast({
                          type: "info",
                          title: "Select Change Detected",
                          message: `Mapped option state level to "${e.target.value}"`,
                        });
                      }}
                    />

                    <Textarea
                      label="VCS Release Notes Summary"
                      placeholder="Describe what has been completed in this revision..."
                      rows={3}
                    />
                  </Stack>
                </Grid>

                <Divider />

                <Grid cols={2} gap="md">
                  <Stack gap="sm">
                    <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Selection states</p>
                    <Checkbox
                      label={
                        <span>
                          Agree to automatic hot-reloads (<strong>RepoPilot</strong> sync)
                        </span>
                      }
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <Checkbox label="Auto-compile TypeScript definitions (noEmit)" disabled checked readOnly />
                  </Stack>

                  <Stack gap="sm">
                    <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Binary Settings (Switches)</p>
                    <Switch
                      label="Enable Live Build Monitoring"
                      description="Auto-ping container routes on every file update"
                      checked={isSwitchOn}
                      onChange={(e) => setIsSwitchOn(e.target.checked)}
                    />
                  </Stack>
                </Grid>
              </CardBody>
            </Card>
          </SectionWrapper>

          {/* Section: Badges */}
          <SectionWrapper
            id="badges"
            title="06 / Engineering Status & Priority Badges"
            description="Polished chips indicating future issue priorities, phase statuses, and deployment indicators."
          >
            <Card>
              <CardBody className="flex flex-col gap-5">
                {/* Status Badges */}
                <div className="flex flex-col gap-2.5">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Example Project Statuses</p>
                  <InlineGroup gap="sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary font-mono w-24">DevHabits:</span>
                      <Badge variant="accent">Building</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary font-mono w-24">RepoPilot:</span>
                      <Badge variant="warning">Testing</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary font-mono w-24">CampusCanteen:</span>
                      <Badge variant="success">Deployed</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary font-mono w-24">LaunchKaro:</span>
                      <Badge variant="neutral">Paused</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-primary font-mono w-24">ProjectDock:</span>
                      <Badge variant="danger">Blocked</Badge>
                    </div>
                  </InlineGroup>
                </div>

                {/* Priorities */}
                <div className="flex flex-col gap-2.5 mt-2">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Engineering Task Priorities</p>
                  <InlineGroup gap="sm">
                    <Badge variant="danger">Critical</Badge>
                    <Badge variant="warning">High</Badge>
                    <Badge variant="info">Medium</Badge>
                    <Badge variant="neutral">Low</Badge>
                  </InlineGroup>
                </div>
              </CardBody>
            </Card>
          </SectionWrapper>

          {/* Section: Cards */}
          <SectionWrapper
            id="cards"
            title="07 / Cards & Containers"
            description="Supports standard visual containers, interactive cards with active shadows, headers, and footer blocks."
          >
            <Grid cols={3} gap="md">
              <Card>
                <CardHeader>
                  <h3 className="text-sm font-semibold text-text-primary">DevHabits Workspace</h3>
                  <p className="text-[10px] text-text-tertiary font-mono">ID: WS-049102</p>
                </CardHeader>
                <CardBody className="text-xs text-text-secondary leading-relaxed">
                  Interactive checklist routines for software architecture guidelines and personal coding metrics trackers.
                </CardBody>
                <CardFooter>
                  <Badge variant="accent">Building</Badge>
                </CardFooter>
              </Card>

              <Card variant="interactive" onClick={() => {
                toast({
                  type: "info",
                  title: "RepoPilot Selected",
                  message: "Transition route simulation requested for RepoPilot.",
                });
              }}>
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-sm font-semibold text-text-primary">RepoPilot</h3>
                    <ExternalLink className="w-3.5 h-3.5 text-text-tertiary" />
                  </div>
                  <p className="text-[10px] text-text-tertiary font-mono">ID: WS-920491</p>
                </CardHeader>
                <CardBody className="text-xs text-text-secondary leading-relaxed">
                  Interactive developer system designed to automatically review Git commits and report lint suggestions.
                </CardBody>
                <CardFooter>
                  <Badge variant="warning">Testing</Badge>
                </CardFooter>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <h3 className="text-sm font-semibold text-text-primary">CampusCanteen</h3>
                  <p className="text-[10px] text-text-tertiary font-mono">ID: WS-310291</p>
                </CardHeader>
                <CardBody className="text-xs text-text-secondary leading-relaxed">
                  A high-volume campus ordering application utilizing a centralized billing queue and fast responsive menus.
                </CardBody>
                <CardFooter>
                  <Badge variant="success">Deployed</Badge>
                </CardFooter>
              </Card>
            </Grid>
          </SectionWrapper>

          {/* Section: Progress */}
          <SectionWrapper
            id="progress"
            title="08 / Progress Indicators"
            description="Linear and text indicators perfect for displaying milestones, checkout logs, or build pipeline stats."
          >
            <Card>
              <CardBody className="flex flex-col gap-5">
                <Progress value={20} showValue variant="danger" />
                <Progress value={55} showValue variant="warning" />
                <Progress value={85} showValue variant="accent" />
                <Progress value={100} showValue variant="success" />
              </CardBody>
            </Card>
          </SectionWrapper>

          {/* Section: Navigation */}
          <SectionWrapper
            id="navigation"
            title="09 / Navigation & Workspace Tabs"
            description="Accessible tabs mapped with sliding backdrop indicators to switch visual layouts."
          >
            <Card>
              <CardBody className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Tab Variant: Underline (default)</p>
                  <Tabs tabs={showcaseTabs} activeTabId={activeTab} onChange={setActiveTab} variant="underline" />
                </div>

                <div className="flex flex-col gap-1.5 mt-3">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Tab Variant: Pills (segmented)</p>
                  <Tabs tabs={showcaseTabs} activeTabId={activeTab} onChange={setActiveTab} variant="pills" />
                </div>

                <div className="mt-4 p-3 bg-muted-surface border border-border-subtle rounded-md">
                  <p className="text-xs text-text-primary">
                    Active Tab State ID: <strong className="font-mono text-accent-primary">{activeTab}</strong>
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {activeTab === "workspace" && "Viewing the full checklist, active files, and workspace logs."}
                    {activeTab === "decisions" && "Reviewing technical decisions register, architectural goals, and guidelines."}
                    {activeTab === "integrations" && "Configuring Google Workspace, calendar locks, and Firestore persistence."}
                    {activeTab === "settings" && "Configuring API variables, design mode overrides, and system preferences."}
                  </p>
                </div>
              </CardBody>
            </Card>
          </SectionWrapper>

          {/* Section: Overlays */}
          <SectionWrapper
            id="overlays"
            title="10 / Overlays, Dialogs & Sheets"
            description="Includes fully interactive alerts, sidebar sheet menus, and responsive bottom sheets."
          >
            <Card>
              <CardBody className="flex flex-col gap-4">
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Modal Dialogs</p>
                <InlineGroup gap="md">
                  <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
                    Launch Dialog Modal
                  </Button>
                </InlineGroup>

                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mt-3">Slide Sheets & Drawers</p>
                <InlineGroup gap="md">
                  <Button variant="secondary" onClick={() => { setSheetSide("right"); setIsSheetOpen(true); }}>
                    Open Right Sheet
                  </Button>
                  <Button variant="secondary" onClick={() => { setSheetSide("left"); setIsSheetOpen(true); }}>
                    Open Left Sheet
                  </Button>
                  <Button variant="secondary" onClick={() => { setSheetSide("bottom"); setIsSheetOpen(true); }}>
                    Open Bottom Drawer
                  </Button>
                </InlineGroup>
              </CardBody>
            </Card>

            {/* Interactive Dialog Modal */}
            <Dialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title="Deploy Confirmation: RepoPilot"
              description="Confirming action will dispatch automated VCS static tags."
              footer={
                <>
                  <Button variant="secondary" size="sm" onClick={() => setIsDialogOpen(false)}>
                    Abort Deploy
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setIsDialogOpen(false);
                      toast({
                        type: "success",
                        title: "VCS Deploy Tag Dispatched",
                        message: "RepoPilot successfully updated to revision v1.0.4-beta.",
                      });
                    }}
                  >
                    Confirm & Publish
                  </Button>
                </>
              }
            >
              <div className="flex flex-col gap-3">
                <p>
                  You are about to compile and trigger a production deployment for <strong>RepoPilot</strong>. This action is irreversible and will rebuild static assets inside the live sandbox environment.
                </p>
                <div className="p-3 bg-muted-surface border border-border-strong rounded font-mono text-xs text-text-secondary">
                  <div>COMMIT: c7b491e0 (Phase 1 assets)</div>
                  <div>AUTHOR: dev-studio@projectdock.internal</div>
                  <div>TARGET: Google Cloud Container Service</div>
                </div>
              </div>
            </Dialog>

            {/* Interactive Slide Sheet */}
            <Sheet
              isOpen={isSheetOpen}
              onClose={() => setIsSheetOpen(false)}
              side={sheetSide}
              title={`Workspace settings (Dock: ${sheetSide})`}
              description="Configure Phase 1 workspace environment hooks and layout values."
              footer={
                <>
                  <Button variant="secondary" size="sm" onClick={() => setIsSheetOpen(false)}>
                    Close Panel
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => {
                    setIsSheetOpen(false);
                    toast({ type: "success", title: "Configuration Updated", message: "Successfully wrote latest options back to memory." });
                  }}>
                    Save Variables
                  </Button>
                </>
              }
            >
              <Stack gap="md">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-text-secondary">Project Details</span>
                  <p className="text-xs text-text-tertiary">
                    Review and configure this module's container dependencies, security boundaries, and live sync mechanisms.
                  </p>
                </div>
                <Input label="Workspace Prefix ID" value="dock-p1-sandbox" readOnly />
                <Select
                  label="Deployment Zone"
                  options={[
                    { value: "us-east", label: "US East (Standard)" },
                    { value: "asia-east", label: "Asia East (Optimized)" },
                    { value: "europe-west", label: "Europe West (Secure)" },
                  ]}
                  defaultValue="asia-east"
                />
                <Switch label="Audit all webhook requests" description="Sign secure checksum tokens on callbacks" checked readOnly />
              </Stack>
            </Sheet>
          </SectionWrapper>

          {/* Section: Feedback / Toasts */}
          <SectionWrapper
            id="feedback"
            title="11 / Notification Toasts"
            description="Polished alerts triggered dynamically through standard Toast provider hooks."
          >
            <Card>
              <CardBody className="flex flex-col gap-4">
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Interactive Toast Dispatches</p>
                <Grid cols={4} gap="sm">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="border-status-success/30 hover:bg-status-success/5"
                    onClick={() =>
                      toast({
                        type: "success",
                        title: "Deployment Finished",
                        message: "CampusCanteen is successfully serving traffic on port 3000.",
                      })
                    }
                  >
                    Success Toast
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="border-status-warning/30 hover:bg-status-warning/5"
                    onClick={() =>
                      toast({
                        type: "warning",
                        title: "Pipeline Warning",
                        message: "TypeScript compiler detected 3 non-blocking layout type mismatches.",
                      })
                    }
                  >
                    Warning Toast
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="border-status-danger/30 hover:bg-status-danger/5"
                    onClick={() =>
                      toast({
                        type: "error",
                        title: "Build Failed",
                        message: "CRITICAL: esbuild module compilation error on file 'App.tsx'.",
                      })
                    }
                  >
                    Error Toast
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="border-status-info/30 hover:bg-status-info/5"
                    onClick={() =>
                      toast({
                        type: "info",
                        title: "Metadata Synchronized",
                        message: "Successfully synchronized ProjectDock metadata registers.",
                      })
                    }
                  >
                    Info Toast
                  </Button>
                </Grid>
              </CardBody>
            </Card>
          </SectionWrapper>

          {/* Section: Skeletons */}
          <SectionWrapper
            id="loading-states"
            title="12 / Loading Skeletons"
            description="Reusable visual placeholders that maintain precise layouts during compilation or fetching delays."
          >
            <Card>
              <CardBody className="flex flex-col gap-4">
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">Project Block Skeletons</p>
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" className="w-10 h-10" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton variant="text" className="w-1/3" />
                    <Skeleton variant="text" className="w-1/2 h-3" />
                  </div>
                </div>
                <div className="mt-2">
                  <Skeleton variant="rectangular" className="h-20 w-full" />
                </div>
              </CardBody>
            </Card>
          </SectionWrapper>

          {/* Section: Empty State */}
          <SectionWrapper
            id="empty-states"
            title="13 / Empty States"
            description="Polished card layouts designed to keep users orientated when lists or query scopes are completely blank."
          >
            <Card>
              <CardBody className="py-8">
                <EmptyState
                  icon={<FolderKanban className="w-6 h-6" />}
                  title="No Milestones Logged"
                  description="You have not created any project milestones yet. Begin logging checkpoints to measure structural momentum."
                  primaryAction={{
                    label: "Add Milestone",
                    onClick: () => {
                      toast({
                        type: "info",
                        title: "Action Intercepted",
                        message: "Add milestone is unrequested in Phase 1.",
                      });
                    },
                  }}
                  secondaryAction={{
                    label: "Import Template",
                    onClick: () => {
                      toast({
                        type: "info",
                        title: "Action Intercepted",
                        message: "Template imports are locked in Phase 1.",
                      });
                    },
                  }}
                />
              </CardBody>
            </Card>
          </SectionWrapper>
        </Stack>
      </SplitLayout>
    </PageContainer>
  );
}
