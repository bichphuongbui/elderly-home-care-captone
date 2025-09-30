import React, { useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiBookOpen, FiPlus, FiMinus, FiArrowLeft, FiBold, FiItalic, FiList, FiLink, FiImage, FiUpload } from 'react-icons/fi';

export interface CourseResource {
  id: string;
  type: 'pdf' | 'video' | 'doc' | 'link';
  title: string;
  size?: string;
  url?: string;
}

export interface LessonContent {
  id: string;
  type: 'text' | 'video' | 'file';
  title: string;
  content?: string; // For text content (HTML)
  url?: string; // For video/file URLs
  size?: string; // For file size
  file?: File; // For uploaded files
}

export interface CourseLesson {
  id: string;
  title: string;
  duration?: string;
  content?: LessonContent[];
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseInstructor {
  name: string;
  title: string;
  initials: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration?: string;
  level?: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  objectives?: string[];
  sections?: CourseSection[];
  resources?: CourseResource[];
  instructor?: CourseInstructor;
  createdAt: string; // ISO string
}

const CourseFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const isEditing = !!courseId;

  // Mock initial data for editing
  const initialCourses: Course[] = useMemo(() => ([
    { 
      id: '1', 
      title: 'Kỹ năng chăm sóc người cao tuổi', 
      description: 'Các nguyên tắc chăm sóc cơ bản và nâng cao cho người cao tuổi, bao gồm dinh dưỡng, vận động và giao tiếp.',
      duration: '4 giờ',
      level: 'Cơ bản',
      objectives: [
        'Nắm vững nguyên tắc an toàn khi hỗ trợ sinh hoạt hằng ngày',
        'Thực hành giao tiếp trấn an và tôn trọng người cao tuổi',
        'Nhận biết sớm dấu hiệu rủi ro và cách xử lý ban đầu'
      ],
      sections: [
        {
          id: 'sec-1',
          title: 'Tổng quan & an toàn',
          lessons: [
            { 
              id: 'l-1', 
              title: 'Giới thiệu vai trò caregiver', 
              duration: '10m',
              content: [
                {
                  id: 'c-1',
                  type: 'text',
                  title: 'Định nghĩa caregiver',
                  content: 'Caregiver là người chăm sóc, hỗ trợ người cao tuổi trong các hoạt động sinh hoạt hàng ngày...'
                },
                {
                  id: 'c-2',
                  type: 'video',
                  title: 'Video giới thiệu',
                  url: 'https://example.com/video1.mp4',
                  size: '5:30'
                }
              ]
            },
            { 
              id: 'l-2', 
              title: 'Nguyên tắc an toàn tại nhà', 
              duration: '18m',
              content: [
                {
                  id: 'c-3',
                  type: 'text',
                  title: 'Các nguyên tắc cơ bản',
                  content: 'Luôn đảm bảo môi trường sống an toàn, loại bỏ các vật cản, đảm bảo ánh sáng đầy đủ...'
                },
                {
                  id: 'c-4',
                  type: 'file',
                  title: 'Checklist an toàn',
                  url: 'https://example.com/checklist.pdf',
                  size: '2.1MB'
                }
              ]
            }
          ]
        }
      ],
      resources: [
        { id: 'r-1', type: 'pdf', title: 'Checklist an toàn trong nhà', size: '1.2MB' },
        { id: 'r-2', type: 'video', title: 'Kỹ thuật di chuyển an toàn', size: '8:24' }
      ],
      instructor: { name: 'BS. Nguyễn Minh Anh', title: 'Chuyên gia Lão khoa', initials: 'MA' },
      createdAt: new Date().toISOString() 
    }
  ]), []);

  const existingCourse = isEditing ? initialCourses.find(c => c.id === courseId) : null;

  const [form, setForm] = useState<{
    title: string;
    description: string;
    duration: string;
    level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao' | '';
    objectives: string[];
    sections: CourseSection[];
    resources: CourseResource[];
    instructor: CourseInstructor;
  }>(() => ({
    title: existingCourse?.title || '',
    description: existingCourse?.description || '',
    duration: existingCourse?.duration || '',
    level: existingCourse?.level || '',
    objectives: existingCourse?.objectives || [],
    sections: existingCourse?.sections || [],
    resources: existingCourse?.resources || [],
    instructor: existingCourse?.instructor || { name: '', title: '', initials: '' }
  }));

  // Helper functions for form management
  const addObjective = () => {
    setForm(prev => ({ ...prev, objectives: [...prev.objectives, ''] }));
  };

  const updateObjective = (index: number, value: string) => {
    setForm(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index: number) => {
    setForm(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addSection = () => {
    const newSection: CourseSection = {
      id: `sec-${Date.now()}`,
      title: '',
      lessons: []
    };
    setForm(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const updateSection = (index: number, field: keyof CourseSection, value: any) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const removeSection = (index: number) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const addLesson = (sectionIndex: number) => {
    const newLesson: CourseLesson = {
      id: `lesson-${Date.now()}`,
      title: '',
      duration: '',
      content: []
    };
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, lessons: [...section.lessons, newLesson] }
          : section
      )
    }));
  };

  const updateLesson = (sectionIndex: number, lessonIndex: number, field: keyof CourseLesson, value: any) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? {
              ...section,
              lessons: section.lessons.map((lesson, j) => 
                j === lessonIndex ? { ...lesson, [field]: value } : lesson
              )
            }
          : section
      )
    }));
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, lessons: section.lessons.filter((_, j) => j !== lessonIndex) }
          : section
      )
    }));
  };

  const addResource = () => {
    const newResource: CourseResource = {
      id: `resource-${Date.now()}`,
      type: 'pdf',
      title: '',
      url: ''
    };
    setForm(prev => ({ ...prev, resources: [...prev.resources, newResource] }));
  };

  const updateResource = (index: number, field: keyof CourseResource, value: any) => {
    setForm(prev => ({
      ...prev,
      resources: prev.resources.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    }));
  };

  const removeResource = (index: number) => {
    setForm(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  // Lesson content management functions
  const addLessonContent = (sectionIndex: number, lessonIndex: number) => {
    const newContent: LessonContent = {
      id: `content-${Date.now()}`,
      type: 'text',
      title: '',
      content: ''
    };
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? {
              ...section,
              lessons: section.lessons.map((lesson, j) => 
                j === lessonIndex 
                  ? { 
                      ...lesson, 
                      content: [...(lesson.content || []), newContent] 
                    }
                  : lesson
              )
            }
          : section
      )
    }));
  };

  const updateLessonContent = (sectionIndex: number, lessonIndex: number, contentIndex: number, field: keyof LessonContent, value: any) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? {
              ...section,
              lessons: section.lessons.map((lesson, j) => 
                j === lessonIndex 
                  ? {
                      ...lesson,
                      content: lesson.content?.map((content, k) => 
                        k === contentIndex ? { ...content, [field]: value } : content
                      ) || []
                    }
                  : lesson
              )
            }
          : section
      )
    }));
  };

  const removeLessonContent = (sectionIndex: number, lessonIndex: number, contentIndex: number) => {
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? {
              ...section,
              lessons: section.lessons.map((lesson, j) => 
                j === lessonIndex 
                  ? {
                      ...lesson,
                      content: lesson.content?.filter((_, k) => k !== contentIndex) || []
                    }
                  : lesson
              )
            }
          : section
      )
    }));
  };

  // Rich text editor functions
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const RichTextEditor: React.FC<{
    content: string;
    onChange: (content: string) => void;
  }> = ({ content, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [localContent, setLocalContent] = useState(content);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize content only once
    React.useEffect(() => {
      if (editorRef.current && !isInitialized) {
        editorRef.current.innerHTML = content || '';
        setLocalContent(content || '');
        setIsInitialized(true);
      }
    }, [content, isInitialized]);

    // Update local content when prop changes (but not during typing)
    React.useEffect(() => {
      if (isInitialized && content !== localContent && !editorRef.current?.contains(document.activeElement)) {
        setLocalContent(content);
        if (editorRef.current) {
          editorRef.current.innerHTML = content || '';
        }
      }
    }, [content, localContent, isInitialized]);

    const handleInput = () => {
      if (editorRef.current) {
        const newContent = editorRef.current.innerHTML;
        setLocalContent(newContent);
        onChange(newContent);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      // Prevent form submission when pressing Enter
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.execCommand('insertHTML', false, '<br>');
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    };

    const handleClick = () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    };

    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand('bold');
            }}
            className="p-2 hover:bg-gray-200 rounded"
            title="Bold"
          >
            <FiBold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand('italic');
            }}
            className="p-2 hover:bg-gray-200 rounded"
            title="Italic"
          >
            <FiItalic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand('underline');
            }}
            className="p-2 hover:bg-gray-200 rounded"
            title="Underline"
          >
            <span className="text-sm font-bold underline">U</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand('strikeThrough');
            }}
            className="p-2 hover:bg-gray-200 rounded"
            title="Strikethrough"
          >
            <span className="text-sm font-bold line-through">S</span>
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand('insertUnorderedList');
            }}
            className="p-2 hover:bg-gray-200 rounded"
            title="Bullet List"
          >
            <FiList className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              executeCommand('insertOrderedList');
            }}
            className="p-2 hover:bg-gray-200 rounded"
            title="Numbered List"
          >
            <span className="text-sm font-bold">1.</span>
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const url = prompt('Enter URL:');
              if (url) executeCommand('createLink', url);
            }}
            className="p-2 hover:bg-gray-200 rounded"
            title="Insert Link"
          >
            <FiLink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const url = prompt('Enter image URL:');
              if (url) executeCommand('insertImage', url);
            }}
            className="p-2 hover:bg-gray-200 rounded"
            title="Insert Image"
          >
            <FiImage className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <select
            onChange={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', e.target.value);
            }}
            className="px-2 py-1 text-sm border border-gray-300 rounded"
            defaultValue=""
          >
            <option value="">Format</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="p">Paragraph</option>
          </select>
        </div>
        
        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onClick={handleClick}
          className="min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
          style={{ 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: '1.6'
          }}
          suppressContentEditableWarning={true}
          data-placeholder="Nhập nội dung bài học..."
        />
      </div>
    );
  };

  // File upload handler
  const handleFileUpload = (
    sectionIndex: number, 
    lessonIndex: number, 
    contentIndex: number, 
    file: File
  ) => {
    const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    updateLessonContent(sectionIndex, lessonIndex, contentIndex, 'file', file);
    updateLessonContent(sectionIndex, lessonIndex, contentIndex, 'size', fileSize);
    updateLessonContent(sectionIndex, lessonIndex, contentIndex, 'title', file.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    // Here you would typically save to API
    console.log('Course data:', {
      ...form,
      id: isEditing ? courseId : `${Date.now()}`,
      createdAt: isEditing ? existingCourse?.createdAt : new Date().toISOString()
    });

    // Navigate back to training page
    navigate('/admin/training');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin/training')}
              className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Quay lại
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditing ? 'Cập nhật thông tin khóa học' : 'Tạo khóa học mới với đầy đủ thông tin'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cơ bản</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên khóa học *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên khóa học"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                  placeholder="Mô tả chi tiết về nội dung khóa học"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng</label>
                  <input
                    value={form.duration}
                    onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: 4 giờ, 2.5 giờ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trình độ</label>
                  <select
                    value={form.level}
                    onChange={e => setForm(prev => ({ ...prev, level: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn trình độ</option>
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Trung cấp">Trung cấp</option>
                    <option value="Nâng cao">Nâng cao</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Những gì sẽ học được</h2>
              <button
                type="button"
                onClick={addObjective}
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FiPlus className="mr-2" /> Thêm mục tiêu
              </button>
            </div>
            
            <div className="space-y-4">
              {form.objectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    value={objective}
                    onChange={e => updateObjective(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mục tiêu học tập"
                  />
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiMinus />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Course Content - Sections and Lessons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Nội dung khóa học</h2>
              <button
                type="button"
                onClick={addSection}
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FiPlus className="mr-2" /> Thêm Module
              </button>
            </div>
            
            <div className="space-y-6">
              {form.sections.map((section, sectionIndex) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      value={section.title}
                      onChange={e => updateSection(sectionIndex, 'title', e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tên module"
                    />
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiMinus />
                    </button>
                  </div>
                  
                  <div className="ml-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Bài học:</span>
                      <button
                        type="button"
                        onClick={() => addLesson(sectionIndex)}
                        className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <FiPlus className="mr-2" /> Thêm bài
                      </button>
                    </div>
                    
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                          <input
                            value={lesson.title}
                            onChange={e => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tên bài học"
                          />
                          <input
                            value={lesson.duration || ''}
                            onChange={e => updateLesson(sectionIndex, lessonIndex, 'duration', e.target.value)}
                            className="w-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="10m"
                          />
                          <button
                            type="button"
                            onClick={() => removeLesson(sectionIndex, lessonIndex)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiMinus />
                          </button>
                        </div>
                        
                        {/* Lesson Content */}
                        <div className="ml-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Nội dung bài học:</span>
                            <button
                              type="button"
                              onClick={() => addLessonContent(sectionIndex, lessonIndex)}
                              className="inline-flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                            >
                              <FiPlus className="mr-1" /> Thêm nội dung
                            </button>
                          </div>
                          
                          {lesson.content && lesson.content.map((content, contentIndex) => (
                            <div key={content.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="space-y-4">
                                {/* Content Type and Title */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <select
                                    value={content.type}
                                    onChange={e => updateLessonContent(sectionIndex, lessonIndex, contentIndex, 'type', e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <option value="text">Text</option>
                                    <option value="video">Video</option>
                                    <option value="file">File</option>
                                  </select>
                                  <input
                                    value={content.title}
                                    onChange={e => updateLessonContent(sectionIndex, lessonIndex, contentIndex, 'title', e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Tiêu đề nội dung"
                                  />
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => removeLessonContent(sectionIndex, lessonIndex, contentIndex)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <FiMinus />
                                    </button>
                                  </div>
                                </div>

                                {/* Content based on type */}
                                {content.type === 'text' ? (
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                                    <RichTextEditor
                                      content={content.content || ''}
                                      onChange={(newContent) => updateLessonContent(sectionIndex, lessonIndex, contentIndex, 'content', newContent)}
                                    />
                                  </div>
                                ) : content.type === 'video' ? (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">URL Video</label>
                                      <input
                                        value={content.url || ''}
                                        onChange={e => updateLessonContent(sectionIndex, lessonIndex, contentIndex, 'url', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://youtube.com/watch?v=..."
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Thời lượng</label>
                                      <input
                                        value={content.size || ''}
                                        onChange={e => updateLessonContent(sectionIndex, lessonIndex, contentIndex, 'size', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="VD: 10:30, 5 phút"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <input
                                          type="file"
                                          id={`file-upload-${content.id}`}
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              handleFileUpload(sectionIndex, lessonIndex, contentIndex, file);
                                            }
                                          }}
                                          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                                        />
                                        <label
                                          htmlFor={`file-upload-${content.id}`}
                                          className="cursor-pointer flex flex-col items-center"
                                        >
                                          <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                                          <span className="text-sm text-gray-600">
                                            {content.file ? content.file.name : 'Click để upload file'}
                                          </span>
                                          <span className="text-xs text-gray-500 mt-1">
                                            PDF, DOC, PPT, Image, Video (Max 50MB)
                                          </span>
                                        </label>
                                      </div>
                                    </div>
                                    {content.file && (
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-sm font-medium text-blue-900">{content.file.name}</p>
                                            <p className="text-xs text-blue-700">{content.size}</p>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              updateLessonContent(sectionIndex, lessonIndex, contentIndex, 'file', undefined);
                                              updateLessonContent(sectionIndex, lessonIndex, contentIndex, 'size', '');
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                          >
                                            Xóa
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Tài liệu đính kèm</h2>
              <button
                type="button"
                onClick={addResource}
                className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FiPlus className="mr-2" /> Thêm tài liệu
              </button>
            </div>
            
            <div className="space-y-4">
              {form.resources.map((resource, index) => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                      value={resource.type}
                      onChange={e => updateResource(index, 'type', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pdf">PDF</option>
                      <option value="video">Video</option>
                      <option value="doc">Document</option>
                      <option value="link">Link</option>
                    </select>
                    <input
                      value={resource.title}
                      onChange={e => updateResource(index, 'title', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tên tài liệu"
                    />
                    <input
                      value={resource.url || ''}
                      onChange={e => updateResource(index, 'url', e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="URL hoặc đường dẫn"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        value={resource.size || ''}
                        onChange={e => updateResource(index, 'size', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Kích thước"
                      />
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiMinus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin giảng viên</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên giảng viên</label>
                <input
                  value={form.instructor.name}
                  onChange={e => setForm(prev => ({ 
                    ...prev, 
                    instructor: { ...prev.instructor, name: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tên giảng viên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ</label>
                <input
                  value={form.instructor.title}
                  onChange={e => setForm(prev => ({ 
                    ...prev, 
                    instructor: { ...prev.instructor, title: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Chức vụ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên viết tắt</label>
                <input
                  value={form.instructor.initials}
                  onChange={e => setForm(prev => ({ 
                    ...prev, 
                    instructor: { ...prev.instructor, initials: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: MA, TN"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={() => navigate('/admin/training')} 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Cập nhật khóa học' : 'Tạo khóa học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormPage;
