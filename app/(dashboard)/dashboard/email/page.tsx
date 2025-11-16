'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Mail,
  Clock,
  Plus,
  Play,
  Pause,
  Copy,
  Trash2,
  Edit,
  ChevronRight,
  BarChart3,
  Users,
  Send,
} from 'lucide-react';

interface EmailStep {
  id: string;
  type: 'email' | 'delay' | 'condition';
  subject?: string;
  content?: string;
  delay?: number;
  delayUnit?: 'minutes' | 'hours' | 'days';
  condition?: string;
}

interface EmailSequence {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused';
  steps: EmailStep[];
  subscribers: number;
  openRate: number;
  clickRate: number;
  createdAt: string;
}

function SortableStep({ step, onEdit, onDelete }: { step: EmailStep; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-move bg-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {step.type === 'email' && (
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
            )}
            {step.type === 'delay' && (
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            )}
            <div className="flex-1">
              {step.type === 'email' && (
                <>
                  <h4 className="font-medium">{step.subject || 'Untitled Email'}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {step.content || 'No content yet...'}
                  </p>
                </>
              )}
              {step.type === 'delay' && (
                <>
                  <h4 className="font-medium">Wait</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {step.delay} {step.delayUnit}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmailSequencePage() {
  const [sequences, setSequences] = useState<EmailSequence[]>([
    {
      id: '1',
      name: 'Welcome Series',
      status: 'active',
      steps: [
        {
          id: 'step-1',
          type: 'email',
          subject: 'Welcome to ContentForge! 👋',
          content: 'Thank you for signing up...',
        },
        {
          id: 'step-2',
          type: 'delay',
          delay: 2,
          delayUnit: 'days',
        },
        {
          id: 'step-3',
          type: 'email',
          subject: 'Getting Started Guide',
          content: 'Here are some tips...',
        },
      ],
      subscribers: 1247,
      openRate: 68.5,
      clickRate: 12.3,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Product Launch Campaign',
      status: 'draft',
      steps: [],
      subscribers: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: '2024-02-01',
    },
  ]);

  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(sequences[0]);
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [editingStep, setEditingStep] = useState<EmailStep | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id && selectedSequence) {
      const oldIndex = selectedSequence.steps.findIndex((step) => step.id === active.id);
      const newIndex = selectedSequence.steps.findIndex((step) => step.id === over.id);

      const updatedSteps = arrayMove(selectedSequence.steps, oldIndex, newIndex);
      const updatedSequence = { ...selectedSequence, steps: updatedSteps };
      setSelectedSequence(updatedSequence);
      setSequences(sequences.map((seq) => (seq.id === selectedSequence.id ? updatedSequence : seq)));
    }
  };

  const addEmailStep = () => {
    if (!selectedSequence) return;
    const newStep: EmailStep = {
      id: `step-${Date.now()}`,
      type: 'email',
      subject: '',
      content: '',
    };
    const updatedSequence = {
      ...selectedSequence,
      steps: [...selectedSequence.steps, newStep],
    };
    setSelectedSequence(updatedSequence);
    setSequences(sequences.map((seq) => (seq.id === selectedSequence.id ? updatedSequence : seq)));
  };

  const addDelayStep = () => {
    if (!selectedSequence) return;
    const newStep: EmailStep = {
      id: `step-${Date.now()}`,
      type: 'delay',
      delay: 1,
      delayUnit: 'days',
    };
    const updatedSequence = {
      ...selectedSequence,
      steps: [...selectedSequence.steps, newStep],
    };
    setSelectedSequence(updatedSequence);
    setSequences(sequences.map((seq) => (seq.id === selectedSequence.id ? updatedSequence : seq)));
  };

  const deleteStep = (stepId: string) => {
    if (!selectedSequence) return;
    const updatedSequence = {
      ...selectedSequence,
      steps: selectedSequence.steps.filter((step) => step.id !== stepId),
    };
    setSelectedSequence(updatedSequence);
    setSequences(sequences.map((seq) => (seq.id === selectedSequence.id ? updatedSequence : seq)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Email Sequences
          </h1>
          <p className="mt-2 text-gray-600">
            Create automated email workflows with drag-and-drop
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Sequence
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sequences List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Sequences</CardTitle>
              <CardDescription>Select a sequence to edit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sequences.map((sequence) => (
                <div
                  key={sequence.id}
                  onClick={() => setSelectedSequence(sequence)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedSequence?.id === sequence.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{sequence.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(sequence.status)}`}>
                      {sequence.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <p className="text-xs text-gray-500">Steps</p>
                      <p className="font-medium">{sequence.steps.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Subscribers</p>
                      <p className="font-medium">{sequence.subscribers.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Workflow Builder */}
        <div className="lg:col-span-2 space-y-4">
          {selectedSequence ? (
            <>
              {/* Sequence Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedSequence.name}</CardTitle>
                      <CardDescription>
                        {selectedSequence.steps.length} steps • {selectedSequence.subscribers.toLocaleString()} subscribers
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {selectedSequence.status === 'active' ? (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Activate
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Performance Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Subscribers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedSequence.subscribers.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Open Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{selectedSequence.openRate}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Click Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{selectedSequence.clickRate}%</div>
                  </CardContent>
                </Card>
              </div>

              {/* Workflow Canvas */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Workflow</CardTitle>
                      <CardDescription>Drag to reorder steps</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={addEmailStep}>
                        <Mail className="h-4 w-4 mr-2" />
                        Add Email
                      </Button>
                      <Button variant="outline" size="sm" onClick={addDelayStep}>
                        <Clock className="h-4 w-4 mr-2" />
                        Add Delay
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedSequence.steps.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No steps yet</h3>
                      <p className="text-gray-500 mb-6">Add your first email or delay to get started</p>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={addEmailStep}>
                          <Mail className="h-4 w-4 mr-2" />
                          Add Email
                        </Button>
                        <Button variant="outline" onClick={addDelayStep}>
                          <Clock className="h-4 w-4 mr-2" />
                          Add Delay
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={selectedSequence.steps.map((step) => step.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {selectedSequence.steps.map((step, index) => (
                            <div key={step.id}>
                              <SortableStep
                                step={step}
                                onEdit={() => {
                                  setEditingStep(step);
                                  setIsEditingStep(true);
                                }}
                                onDelete={() => deleteStep(step.id)}
                              />
                              {index < selectedSequence.steps.length - 1 && (
                                <div className="flex justify-center my-2">
                                  <ChevronRight className="h-6 w-6 text-gray-400 rotate-90" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">Select a sequence to edit</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
