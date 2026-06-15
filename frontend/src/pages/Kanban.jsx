import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MoreHorizontal } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TaskModal from '../components/TaskModal'
import useTaskStore from '../store/taskStore'
import toast from 'react-hot-toast'

const columns = [
  {
    id: 'todo',
    label: 'To Do',
    color: 'bg-zinc-400',
    headerColor: 'text-zinc-300',
    countColor: 'bg-zinc-700 text-zinc-300',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    color: 'bg-blue-400',
    headerColor: 'text-blue-300',
    countColor: 'bg-blue-500/20 text-blue-300',
  },
  {
    id: 'done',
    label: 'Done',
    color: 'bg-emerald-400',
    headerColor: 'text-emerald-300',
    countColor: 'bg-emerald-500/20 text-emerald-300',
  },
]

const priorityDot = {
  low: 'bg-emerald-400',
  medium: 'bg-yellow-400',
  high: 'bg-red-400',
}

export default function Kanban() {
  const { tasks, fetchTasks, updateTask, fetchStats } = useTaskStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [defaultStatus, setDefaultStatus] = useState('todo')

  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [])

  const getColumnTasks = (status) =>
    tasks.filter((t) => t.status === status)

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    const taskId = parseInt(draggableId)
    const newStatus = destination.droppableId

    // Optimistic update
    const { updateTask: update } = useTaskStore.getState()
    useTaskStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    }))

    const res = await updateTask(taskId, { status: newStatus })
    if (!res.success) {
      toast.error('Failed to update task')
      fetchTasks()
    } else {
      fetchStats()
    }
  }

  const openNewTask = (status) => {
    setDefaultStatus(status)
    setEditTask(null)
    setModalOpen(true)
  }

  const handleEdit = (task) => {
    setEditTask(task)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditTask(null)
    fetchTasks()
    fetchStats()
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />

  <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-3">          <div>
            <h1 className="text-2xl font-bold text-white">Kanban Board</h1>
            <p className="text-zinc-500 text-sm mt-1">Drag and drop tasks to update their status.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openNewTask('todo')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            New Task
          </motion.button>
        </div>

        {/* Board */}
        <DragDropContext onDragEnd={onDragEnd}>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-start">            {columns.map((col) => {
              const colTasks = getColumnTasks(col.id)
              return (
                <div key={col.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col.color}`} />
                      <span className={`text-sm font-semibold ${col.headerColor}`}>
                        {col.label}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${col.countColor}`}>
                        {colTasks.length}
                      </span>
                    </div>
                    <button
                      onClick={() => openNewTask(col.id)}
                      className="w-6 h-6 rounded-md bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Droppable */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] space-y-3 rounded-xl transition-colors ${
                          snapshot.isDraggingOver ? 'bg-indigo-500/5' : ''
                        }`}
                      >
                        <AnimatePresence>
                          {colTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={String(task.id)}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`bg-zinc-800 border rounded-xl p-4 cursor-grab active:cursor-grabbing group transition-all ${
                                      snapshot.isDragging
                                        ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10 rotate-1 scale-105'
                                        : 'border-zinc-700 hover:border-zinc-600'
                                    }`}
                                  >
                                    {/* Card top */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <p className={`text-sm font-medium leading-snug flex-1 ${
                                        task.status === 'done'
                                          ? 'line-through text-zinc-500'
                                          : 'text-white'
                                      }`}>
                                        {task.title}
                                      </p>
                                      <button
                                        onClick={() => handleEdit(task)}
                                        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-zinc-400 hover:text-white transition shrink-0"
                                      >
                                        <MoreHorizontal className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Description */}
                                    {task.description && (
                                      <p className="text-xs text-zinc-500 mb-3 line-clamp-2">
                                        {task.description}
                                      </p>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${priorityDot[task.priority] || 'bg-zinc-500'}`} />
                                      <span className="text-xs text-zinc-500 capitalize">{task.priority}</span>

                                      {task.dueDate && (
                                        <span className={`text-xs ml-auto ${
                                          new Date(task.dueDate) < new Date() && task.status !== 'done'
                                            ? 'text-red-400'
                                            : 'text-zinc-500'
                                        }`}>
                                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                          })}
                                        </span>
                                      )}
                                    </div>
                                  </motion.div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}

                        {/* Empty state */}
                        {colTasks.length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex flex-col items-center justify-center h-32 border border-dashed border-zinc-800 rounded-xl">
                            <p className="text-zinc-600 text-xs">No tasks here</p>
                            <button
                              onClick={() => openNewTask(col.id)}
                              className="text-indigo-500 hover:text-indigo-400 text-xs mt-1 transition"
                            >
                              + Add one
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </main>

      <TaskModal isOpen={modalOpen} onClose={handleCloseModal} task={editTask} />
    </div>
  )
}