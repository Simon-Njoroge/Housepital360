'use client';

import React, { useEffect, useRef, useState } from 'react';
import { socket } from '@/utils/socket';
import {
  FaPaperPlane,
  FaUserMd,
  FaVial,
  FaCapsules,
  FaMoneyBill,
  FaUser,
  FaUserNurse,
  FaUserFriends,
  FaSearch,
  FaBars,
  FaTimes,
  FaRobot,
  FaCheck,
  FaCheckDouble,
} from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@tanstack/react-store';
import { authStore } from '@/store/authstore';
import { cn } from '@/lib/utils';
import { useTheme } from '@/utils/themeProvider';
import { useUsersStoreActions } from '@/store/userstore';
import { useChatHistory } from '@/hooks/usechat';
import { useAllUsers } from '@/hooks/userhook';
const roleIcons: Record<string, JSX.Element> = {
  doctor: <FaUserMd className="text-blue-500" />,
  labtech: <FaVial className="text-purple-500" />,
  pharmacist: <FaCapsules className="text-pink-500" />,
  finance: <FaMoneyBill className="text-green-500" />,
  receptionist: <FaUserNurse className="text-yellow-500" />,
  patient: <FaUserFriends className="text-orange-500" />,
  ai: <FaRobot className="text-gray-500" />,
  default: <FaUser className="text-gray-400" />,
};

const RoleIcon = ({ role }: { role: string }) => roleIcons[role] || roleIcons.default;

export default function ChatPage() {
  const { userId, role: userRole } = useStore(authStore);
    const { data } = useAllUsers();
    console.log(data)
    const { theme } = useTheme();
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [messages, setMessages] = useState<Record<string, any[]>>({});
    const [input, setInput] = useState('');
    const [search, setSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [filterRole, setFilterRole] = useState('');
  
    const scrollRef = useRef<HTMLDivElement>(null);
  
    // Fetch chat history using the useChatHistory hook
    const { data: chatHistory, isLoading } = useChatHistory(userId ?? '', selectedUser?.id || '', 1, 20);
  
    useEffect(() => {
      socket.auth = { userId };
      socket.connect();
  
      socket.on('receive_message', (message: any) => {
        setMessages((prev) => ({
          ...prev,
          [message.sender.id]: [...(prev[message.sender.id] || []), message],
        }));
      });
  
      return () => {
        socket.disconnect();
      };
    }, [userId]);
  
    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedUser]);
  
    useEffect(() => {
      if (chatHistory && selectedUser) {
        setMessages((prev) => ({
          ...prev,
          [selectedUser.id]: chatHistory,
        }));
      }
    }, [chatHistory, selectedUser]);
  
    const sendMessage = () => {
      if (!input.trim() || !selectedUser) return;
  
      const message = {
        sender: { id: userId, role: userRole },
        recipient: { id: selectedUser.id, role: selectedUser.role },
        content: input.trim(),
        read: false,
      };
  
      socket.emit('send_message', {
        senderId: userId,
        recipientId: selectedUser.id,
        content: message.content,
      });
  
      setMessages((prev) => ({
        ...prev,
        [selectedUser.id]: [
          ...(prev[selectedUser.id] || []),
          { ...message, sentAt: new Date().toISOString() },
        ],
      }));
      setInput('');
    };
  
    const sendAIMessage = () => {
      if (!input.trim()) return;
  
      const aiMessage = {
        sender: { id: 'ai', role: 'ai' },
        recipient: { id: userId, role: userRole },
        content: `AI Response: ${input.trim()}`,
        read: true,
      };
  
      setMessages((prev) => ({
        ...prev,
        [String(userId)]: [
          ...(prev[String(userId)] || []),
          { ...aiMessage, sentAt: new Date().toISOString() },
        ],
      }));
      setInput('');
    };
  
    const filteredUsers = (data as any)?.users
      ?.filter((u:any) => u.id !== userId)
      .filter((u:any) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.role?.includes(search))
      .filter((u:any) => !filterRole || u.role === filterRole);
  
    const groupMessagesByDate = (messages: any[]) => {
      const grouped: Record<string, any[]> = {};
      messages.forEach((msg) => {
        const date = new Date(msg.sentAt).toLocaleDateString();
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(msg);
      });
      return grouped;
    };
  
    return (
      <div className={cn('flex h-screen', theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900')}>
        {/* Sidebar */}
        <div className={cn('w-64 border-r p-4 overflow-y-auto space-y-4', sidebarOpen ? 'block' : 'hidden', 'lg:block')}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Users</h3>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <FaTimes />
            </button>
          </div>
  
          <div className="relative">
            <FaSearch className="absolute top-2.5 left-3 text-zinc-400" />
            <Input
              className="pl-10"
              placeholder="Search by name/role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
  
          <div className="mt-4">
            <label className="text-sm font-medium">Filter by Role:</label>
            <select
              className={cn(
                'w-full mt-2 p-2 border rounded-md',
                theme === 'dark' ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-black border-zinc-300',
              )}
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="labtech">Lab Technician</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="finance">Finance</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>
  
          {filteredUsers?.length ? (
            filteredUsers.map((user:any) => (
              <div
                key={user.id}
                className={cn(
                  'p-2 rounded-lg cursor-pointer flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800',
                  selectedUser?.id === user.id && 'bg-zinc-200 dark:bg-zinc-700',
                )}
                onClick={() => {
                  setSelectedUser(user);
                  setSidebarOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <RoleIcon role={user.role} />
                  <span>{user.id === userId ? 'Me' : user.name || user.role}</span>
                </div>
                <div
                  className={cn('h-2 w-2 rounded-full', (user as any).online ? 'bg-green-500' : 'bg-gray-400')}
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500 mt-4">No users found.</p>
          )}
        </div>
  
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col p-4 relative">
          <button className="absolute top-4 left-4 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
  
          {selectedUser ? (
            <>
              <div className="border-b pb-2 mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <RoleIcon role={selectedUser.role} />
                  Chat with {selectedUser.name}
                </h2>
                <p className="text-xs text-zinc-400">End-to-End Encrypted. Even Housepital360 cannot view these messages.</p>
              </div>
  
              <div className="flex-1 overflow-y-auto relative px-1 py-2 space-y-3">
                {/* Grouped Messages */}
                {Object.entries(groupMessagesByDate(messages[selectedUser.id] || [])).map(([date, msgs]) => (
                  <div key={date}>
                    <p className="text-center  text-xs text-zinc-500 mb-2">{date === new Date().toLocaleDateString() ? 'Today' : date}</p>
                    {msgs.map((msg, i) => {
                      const isOwn = msg.sender.id === userId;
                      return (
                        <div key={i} className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
                          <div
                            className={cn(
                              'max-w-[70%] px-4 py-2 rounded-xl shadow-sm mt-1',
                              isOwn ? 'bg-blue-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white',
                            )}
                          >
                            <p className="text-sm ">{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70 text-right flex items-center gap-1">
                              {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString() : 'Now'}
                              {msg.read ? <FaCheckDouble /> : <FaCheck />}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
  
              <div className="mt-4 flex items-center gap-2">
                <Input
                  className="flex-1"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={!input.trim()}>
                  <FaPaperPlane />
                </Button>
                <Button onClick={sendAIMessage} disabled={!input.trim()}>
                  <FaRobot />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">Select a user to start chatting.</div>
          )}
        </div>
      </div>
    );
}