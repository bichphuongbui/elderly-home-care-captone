import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiCheckCircle, FiMessageCircle, FiFileText, FiBookOpen, FiAlertTriangle, FiBell, FiChevronRight, FiPlay, FiList } from 'react-icons/fi';

const CareGiverDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage và làm tươi từ API
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    const readUser = () => {
      try {
        const stored = localStorage.getItem('current_user');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        console.error('Error parsing current user:', e);
        return null;
      }
    };

    const fetchFresh = async (userId: string) => {
      try {
        const res = await fetch(`https://68aed258b91dfcdd62ba657c.mockapi.io/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('current_user', JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.error('Error fetching user by id:', e);
      }
      return null;
    };

    const init = async () => {
      const stored = readUser();
      if (stored?.id) {
        const fresh = await fetchFresh(stored.id);
        setCurrentUser(fresh || stored);
      } else {
        setCurrentUser(null);
      }
      setLoadingUser(false);
    };
    init();
  }, []);

  const caregiverName = useMemo(() => {
    return currentUser?.fullName || currentUser?.name || currentUser?.username || "Người chăm sóc";
  }, [currentUser]);

  const profileStatus: 'approved' | 'pending' | 'rejected' | 'incomplete' = useMemo(() => {
    const status = (currentUser?.status || '').toString().toLowerCase();
    if (['approved', 'active'].includes(status)) return 'approved';
    if (['pending', 'awaiting', 'verifying'].includes(status)) return 'pending';
    if (['rejected', 'declined'].includes(status)) return 'rejected';
    return 'incomplete';
  }, [currentUser]);
  
  // Lịch làm việc (mock) với ngày cụ thể (YYYY-MM-DD)
  const today = useMemo(() => new Date(), []);
  const formatISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const addDays = (d: Date, days: number) => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + days);
    return nd;
  };

  const scheduleEvents = [
    {
      id: 1,
      date: formatISODate(today),
      start: '14:00',
      end: '16:00',
      patientName: 'Bà Nguyễn Thị B',
      service: 'Chăm sóc cá nhân',
      status: 'upcoming',
      location: 'Q.1, TP.HCM'
    },
    {
      id: 2,
      date: formatISODate(today),
      start: '08:00',
      end: '10:00',
      patientName: 'Ông Trần Văn C',
      service: 'Vận động trị liệu',
      status: 'in-progress',
      location: 'Q.3, TP.HCM'
    },
    {
      id: 3,
      date: formatISODate(addDays(today, 2)),
      start: '18:00',
      end: '20:00',
      patientName: 'Bà Lê Thị D',
      service: 'Chăm sóc buổi tối',
      status: 'completed',
      location: 'Q.7, TP.HCM'
    }
  ];

  // Xoá phần nhiệm vụ theo yêu cầu

  const trainingCourses = [
    {
      id: 1,
      name: "Kỹ năng chăm sóc người cao tuổi",
      duration: "2 giờ",
      level: "Cơ bản"
    },
    {
      id: 2,
      name: "Xử lý tình huống khẩn cấp",
      duration: "1.5 giờ",
      level: "Nâng cao"
    }
  ];



  // Fake metrics/messages/reports
  const metrics = useMemo(() => ({
    monthlyAppointments: 28,
    upcomingThisWeek: 5,
    averageRating: 4.8,
    totalReviews: 156,
  }), []);

  // Notifications for bell icon
  const notifications = useMemo(() => {
    const items: Array<{ id: number; type: 'profile' | 'report' | 'training'; message: string; action?: () => void; icon: React.ReactNode }>
      = [];
    if (profileStatus === 'incomplete') {
      items.push({ id: 1, type: 'profile', message: 'Hồ sơ chưa hoàn thiện. Bổ sung chứng chỉ để được duyệt.', action: () => navigate('/care-giver/certificates'), icon: <FiAlertTriangle className="h-4 w-4 text-yellow-600" /> });
    }
    if (profileStatus === 'pending') {
      items.push({ id: 2, type: 'profile', message: 'Hồ sơ đang chờ duyệt. Bạn sẽ được thông báo khi có kết quả.', icon: <FiAlertTriangle className="h-4 w-4 text-yellow-600" /> });
    }
    
    items.push({ id: 4, type: 'training', message: 'Có tài liệu đào tạo mới về xử lý khẩn cấp.', action: () => navigate('/care-giver/training'), icon: <FiBookOpen className="h-4 w-4 text-purple-600" /> });
    return items;
  }, [navigate, profileStatus]);

  // Today's appointments and task management
  const todayAppointments = useMemo(() => {
    return scheduleEvents.filter(event => event.date === formatISODate(today));
  }, [scheduleEvents, today]);

  // Task model aligned with BookingDetailPage
  type TaskType = 'fixed' | 'flexible' | 'optional';
  type CareTask = {
    id: number;
    type: TaskType;
    name: string;
    description?: string;
    days?: string[];
    date?: string;
    startTime?: string;
    endTime?: string;
    completed: boolean;
  };

  // State for active appointment and tasks
  const [activeAppointmentId, setActiveAppointmentId] = useState<number | null>(() => {
    const saved = localStorage.getItem('activeAppointmentId');
    return saved ? parseInt(saved) : null;
  });
  
  const [appointmentTasks, setAppointmentTasks] = useState<{[key: number]: CareTask[]}>({});

  // Initialize appointment tasks only once on component mount
  useEffect(() => {
    const saved = localStorage.getItem('appointmentTasks');
    let existingTasks: {[key: number]: CareTask[]} = {};
    
    if (saved) {
      try {
        const raw = JSON.parse(saved);
        // Migrate from old schema if needed (items without type/name)
        const cleaned: {[key: number]: CareTask[]} = {};
        Object.keys(raw || {}).forEach((k) => {
          const arr = Array.isArray(raw[k]) ? raw[k] : [];
          if (arr.length > 0 && typeof arr[0] === 'object' && 'type' in arr[0]) {
            cleaned[Number(k)] = arr as CareTask[];
          }
        });
        existingTasks = cleaned;
      } catch (e) {
        console.error('Error parsing appointment tasks:', e);
      }
    }

    setAppointmentTasks(existingTasks);
  }, []); // Only run once on mount

  // Separate effect to create default tasks for new appointments
  useEffect(() => {
    setAppointmentTasks(prev => {
      const newTasks = { ...prev };
      let hasNewTasks = false;
      
      todayAppointments.forEach(appointment => {
        if (!newTasks[appointment.id]) {
          // Default demo tasks grouped as booking detail style
          const date = appointment.date;
          newTasks[appointment.id] = [
            {
              id: 1,
              type: 'fixed',
              name: 'Uống thuốc huyết áp',
              description: 'Nhắc và theo dõi uống thuốc theo chỉ định bác sĩ',
              days: ['Thứ 7'],
              date,
              startTime: '09:00',
              endTime: '09:10',
              completed: false,
            },
            {
              id: 2,
              type: 'fixed',
              name: 'Vận động nhẹ',
              description: 'Hướng dẫn vận động khớp 15 phút',
              days: ['Thứ 7'],
              date,
              startTime: '10:30',
              endTime: '10:45',
              completed: false,
            },
            {
              id: 3,
              type: 'flexible',
              name: 'Trò chuyện',
              description: 'Giao tiếp ấm áp, hỏi thăm tinh thần 15–20 phút',
              days: ['Thứ 7'],
              date,
              startTime: '09:30',
              endTime: '09:50',
              completed: false,
            },
            {
              id: 4,
              type: 'flexible',
              name: 'Dọn dẹp nhẹ',
              description: 'Sắp xếp chăn gối, lau bàn, đổ rác',
              days: ['Thứ 7'],
              date,
              startTime: '11:00',
              endTime: '11:20',
              completed: false,
            },
            {
              id: 5,
              type: 'optional',
              name: 'Đọc sách',
              description: 'Đọc báo/sách 10–15 phút nếu còn thời gian',
              days: ['Thứ 7'],
              date,
              completed: false,
            },
          ];
          hasNewTasks = true;
        }
      });
      
      return hasNewTasks ? newTasks : prev;
    });
  }, [todayAppointments.length]); // Only depend on the length, not the whole array

  // Save to localStorage whenever states change
  useEffect(() => {
    if (activeAppointmentId !== null) {
      localStorage.setItem('activeAppointmentId', activeAppointmentId.toString());
    } else {
      localStorage.removeItem('activeAppointmentId');
    }
  }, [activeAppointmentId]);

  useEffect(() => {
    // Only save to localStorage if appointmentTasks is not empty
    if (Object.keys(appointmentTasks).length > 0) {
      localStorage.setItem('appointmentTasks', JSON.stringify(appointmentTasks));
    }
  }, [appointmentTasks]);

  const startAppointment = (appointmentId: number) => {
    if (activeAppointmentId && activeAppointmentId !== appointmentId) {
      alert('Bạn đang trong cuộc hẹn khác. Vui lòng hoàn thành cuộc hẹn hiện tại trước khi bắt đầu cuộc hẹn mới.');
      return;
    }
    setActiveAppointmentId(appointmentId);
    // Map today's appointment to booking id for cross-page sync (demo uses BK002 for in-progress sample)
    // In real app, appointment should have a bookingId field. We'll infer using patientName for mock.
    const mapped = appointmentId === 2 ? 'BK002' : appointmentId === 1 ? 'BK001' : 'BK003';
    localStorage.setItem('booking_active', mapped);
  };

  const toggleAppointmentTask = (appointmentId: number, taskId: number) => {
    setAppointmentTasks(prev => ({
      ...prev,
      [appointmentId]: prev[appointmentId]?.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ) || []
    }));
  };

  const finishAppointment = () => {
    setActiveAppointmentId(null);
    // Keep the tasks data for future reference
    // Clear shared booking flag
    localStorage.removeItem('booking_active');
  };

  // Week view data
  const getWeekDays = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Start from Monday
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const weekDays = getWeekDays();
  
  // Notification dropdown state
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="space-y-6">
      {/* Greeting + Notification bell */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chào mừng bạn, {loadingUser ? '...' : caregiverName}
            </h1>
            <p className="text-gray-600 text-lg">
              Dưới đây là tổng quan về hoạt động chăm sóc của bạn
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
              >
                <FiBell className="h-6 w-6 text-blue-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-10">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">Thông báo</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    <div className="space-y-3">
                      {notifications.map(n => (
                        <div key={n.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            {n.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{n.message}</p>
                            {n.action && (
                              <button onClick={n.action} className="text-xs text-blue-600 hover:text-blue-700 mt-1">
                                Xem chi tiết →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Số lịch hẹn tháng này</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.monthlyAppointments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiCalendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lịch hẹn sắp tới trong tuần</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.upcomingThisWeek}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiMessageCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đánh giá trung bình</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.averageRating}/5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiFileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số đánh giá</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalReviews}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Week schedule */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FiCalendar className="h-5 w-5 mr-2 text-blue-600" />
            Lịch làm việc tuần này
          </h2>
          <button onClick={() => navigate('/care-giver/schedule')} className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
            Chi tiết <FiChevronRight className="ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const dayEvents = scheduleEvents.filter(e => e.date === formatISODate(day));
            const isToday = day.toDateString() === new Date().toDateString();
            const dayName = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index];
            
            return (
              <div key={index} className={`p-3 rounded-lg border ${isToday ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}>
                <div className="text-center">
                  <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                    {dayName}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                    {day.getDate()}
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">{dayEvents.length}</span> lịch hẹn
                    </div>
                    {dayEvents.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">{dayEvents.length * 2}</span> nhiệm vụ
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's appointments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FiCalendar className="h-5 w-5 mr-2 text-blue-600" />
          Cuộc hẹn hôm nay
        </h2>
        
        {todayAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiCalendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Không có cuộc hẹn nào hôm nay</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map((appointment) => {
              const isActive = activeAppointmentId === appointment.id;
              const hasStarted = appointmentTasks[appointment.id]?.some(task => task.completed) || isActive;
              
              return (
                <div key={appointment.id} className={`border rounded-lg p-4 ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                          appointment.status === 'in-progress' || isActive ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status === 'completed' ? 'Hoàn thành' :
                           appointment.status === 'in-progress' || isActive ? 'Đang thực hiện' :
                           'Sắp tới'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                      <p className="text-sm text-gray-500">
                        <FiClock className="inline h-4 w-4 mr-1" />
                        {appointment.start} - {appointment.end} • {appointment.location}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {!isActive && !hasStarted && (
                        <button
                          onClick={() => startAppointment(appointment.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <FiPlay className="h-4 w-4" />
                          <span>Bắt đầu</span>
                        </button>
                      )}
                      
                      {(isActive || hasStarted) && (
                        <button
                          onClick={() => setActiveAppointmentId(isActive ? null : appointment.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                          <FiList className="h-4 w-4" />
                          <span>{isActive ? 'Ẩn nhiệm vụ' : 'Chi tiết nhiệm vụ'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Tasks for active appointment - grouped like booking detail */}
                  {isActive && appointmentTasks[appointment.id] && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {(() => {
                        const tasks = appointmentTasks[appointment.id];
                        const groups: Record<TaskType, CareTask[]> = {
                          fixed: tasks.filter(t => t.type === 'fixed'),
                          flexible: tasks.filter(t => t.type === 'flexible'),
                          optional: tasks.filter(t => t.type === 'optional'),
                        };
                        const meta: Record<TaskType, { title: string; bar: string }> = {
                          fixed: { title: 'Nhiệm vụ cố định', bar: 'bg-blue-500' },
                          flexible: { title: 'Nhiệm vụ linh hoạt', bar: 'bg-violet-500' },
                          optional: { title: 'Nhiệm vụ tuỳ chọn', bar: 'bg-amber-500' },
                        };

                        const total = tasks.length || 1;
                        const done = tasks.filter(t => t.completed).length;
                        const percent = Math.round((done / total) * 100);

                        return (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <FiCheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Danh sách nhiệm vụ
                            </h4>

                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>Hoàn thành: {done}/{total}</span>
                              </div>
                            </div>

                            {(['fixed','flexible','optional'] as TaskType[]).map((key) => {
                              const list = groups[key];
                              if (list.length === 0) return null;
                              const d = list.filter(t => t.completed).length;
                              const per = Math.round((d / (list.length || 1)) * 100);
                              return (
                                <div key={key} className="mt-4">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-semibold text-gray-900">{meta[key].title}</h5>
                                  </div>
                                    <div className="mt-2">
                                      <div className="flex items-center justify-between text-xs text-gray-600">
                                        <span>Hoàn thành: {d}/{list.length}</span>
                                      </div>
                                    </div>
                                  <ul className="mt-3 space-y-2">
                                    {list.map(task => (
                                      <li key={task.id}>
                                        <button
                                          type="button"
                                          onClick={() => toggleAppointmentTask(appointment.id, task.id)}
                                          className={`w-full rounded-lg border px-3 py-2 text-left ${task.completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        >
                                          <div className="w-full text-left">
                                            <div className={`flex items-center justify-between ${task.completed ? 'text-emerald-700' : 'text-gray-800'}`}>
                                              <span className="font-medium">{task.name}</span>
                                              <span className={`text-xs ${task.completed ? 'text-emerald-700' : 'text-gray-400'}`}>{task.completed ? '✔' : ''}</span>
                                            </div>
                                            {(task.description || task.days || task.startTime || task.date) && (
                                              <div className="mt-1 text-xs text-gray-600">
                                                {task.description && <div className="leading-5">{task.description}</div>}
                                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                                                  {task.days && task.days.length > 0 && !task.date && (
                                                    <span className="inline-flex items-center gap-1">
                                                      <span className="text-gray-500">Ngày:</span>
                                                      <span className="text-gray-700">{task.days.join(', ')}</span>
                                                    </span>
                                                  )}
                                                  {/* Fixed: show weekday instead of date; keep time */}
                                                  {task.type === 'fixed' && task.date && (
                                                    <span className="inline-flex items-center gap-1">
                                                      <span className="text-gray-500">Thứ:</span>
                                                      <span className="text-gray-700">{(() => {
                                                        const d = new Date(`${task.date}T00:00:00`);
                                                        const day = d.getDay();
                                                        return isNaN(d.getTime()) ? '' : (day === 0 ? 'Chủ nhật' : `Thứ ${day + 1}`);
                                                      })()}</span>
                                                    </span>
                                                  )}
                                                  {/* Flexible: only show weekday (no time) */}
                                                  {task.type === 'flexible' && task.date && (
                                                    <span className="inline-flex items-center gap-1">
                                                      <span className="text-gray-500">Thứ:</span>
                                                      <span className="text-gray-700">{(() => {
                                                        const d = new Date(`${task.date}T00:00:00`);
                                                        const day = d.getDay();
                                                        return isNaN(d.getTime()) ? '' : (day === 0 ? 'Chủ nhật' : `Thứ ${day + 1}`);
                                                      })()}</span>
                                                    </span>
                                                  )}
                                                  {/* Optional: remove date and time completely */}
                                                  {task.type !== 'optional' && task.type === 'fixed' && task.startTime && (
                                                    <span className="inline-flex items-center gap-1">
                                                      <span className="text-gray-500">Thời gian:</span>
                                                      <span className="text-gray-700">{task.startTime}{task.endTime ? ` – ${task.endTime}` : ''}</span>
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}

                            {/* Legacy fallback: if no groups detected but there are tasks, render a simple flat list */}
                            {groups.fixed.length === 0 && groups.flexible.length === 0 && groups.optional.length === 0 && tasks.length > 0 && (
                              <ul className="mt-3 space-y-2">
                                {tasks.map(task => (
                                  <li key={task.id}>
                                    <button
                                      type="button"
                                      onClick={() => toggleAppointmentTask(appointment.id, task.id)}
                                      className={`w-full rounded-lg border px-3 py-2 text-left ${task.completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                    >
                                      <div className="w-full text-left">
                                        <div className={`flex items-center justify-between ${task.completed ? 'text-emerald-700' : 'text-gray-800'}`}>
                                          <span className="font-medium">{task.name || 'Nhiệm vụ'}</span>
                                          <span className={`text-xs ${task.completed ? 'text-emerald-700' : 'text-gray-400'}`}>{task.completed ? '✔' : ''}</span>
                                        </div>
                                        {(task.description) && (
                                          <div className="mt-1 text-xs text-gray-600">
                                            <div className="leading-5">{task.description}</div>
                                          </div>
                                        )}
                                      </div>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => finishAppointment()}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                Hoàn thành cuộc hẹn
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Removed Tasks section per request */}

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => navigate('/care-giver/schedule')} className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-lg mr-3">
                <FiCalendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Xem lịch làm việc</p>
                <p className="text-sm text-gray-600">Quản lý lịch hẹn sắp tới</p>
              </div>
            </div>
          </button>
          <button onClick={() => navigate('/care-giver/tasks')} className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-lg mr-3">
                <FiFileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Gửi báo cáo</p>
                <p className="text-sm text-gray-600">Hoàn thành biên bản lịch hẹn</p>
              </div>
            </div>
          </button>
          <button onClick={() => navigate('/care-giver/bookings')} className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-lg mr-3">
                <FiClock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Xem yêu cầu booking</p>
                <p className="text-sm text-gray-600">Nhận lịch hẹn phù hợp</p>
              </div>
            </div>
          </button>
          <button onClick={() => navigate('/care-giver/availability')} className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-lg mr-3">
                <FiCalendar className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Thiết lập lịch rảnh</p>
                <p className="text-sm text-gray-600">Cấu hình khung giờ rảnh trong tuần</p>
              </div>
            </div>
          </button>
          <button onClick={() => navigate('/care-giver/training')} className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-lg mr-3">
                <FiBookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Truy cập đào tạo</p>
                <p className="text-sm text-gray-600">Cập nhật kiến thức</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Training Suggestions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FiBookOpen className="h-5 w-5 mr-2 text-purple-600" />
          Gợi ý đào tạo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainingCourses.map((course) => (
            <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-600">{course.duration} • {course.level}</p>
                </div>
                <button onClick={() => navigate('/care-giver/training')} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Xem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareGiverDashboardPage;
