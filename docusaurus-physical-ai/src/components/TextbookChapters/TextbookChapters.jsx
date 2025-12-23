import React from 'react';

const TextbookChapters = () => {
  const chapters = [
    {
      id: 1,
      title: "Textbook Overview",
      description: "Course introduction, modules, hardware requirements, and learning objectives.",
      icon: "📚"
    },
    {
      id: 2,
      title: "Module 1: Humanoid Fundamentals",
      description: "Robot anatomy, kinematics, dynamics, stability control.",
      icon: "🤖"
    },
    {
      id: 3,
      title: "Module 2: ROS 2 System",
      description: "ROS 2 architecture, nodes, topics, URDF, and Python integration.",
      icon: "⚙️"
    },
    {
      id: 4,
      title: "Module 3: Digital Twins",
      description: "Gazebo simulation, Unity, HIL, sensor simulation, and physics modeling.",
      icon: "🎮"
    },
    {
      id: 5,
      title: "Module 4: Perception & Vision",
      description: "Cameras, LiDAR, depth sensing, SLAM, and computer vision.",
      icon: "👁️"
    },
    {
      id: 6,
      title: "Module 5: Control Systems",
      description: "PID control, model predictive control, and motion planning.",
      icon: "🎛️"
    },
    {
      id: 7,
      title: "Module 6: Learning & AI",
      description: "Reinforcement learning, imitation learning, and policy optimization.",
      icon: "🧠"
    },
    {
      id: 8,
      title: "Module 7: Real-World Deployment",
      description: "Hardware integration, deployment strategies, and field testing.",
      icon: "🚀"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl">
            Textbook Chapters
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto opacity-80">
            8 comprehensive modules covering Physical AI & AI Native
          </p>
        </div>

        {/* Chapter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Gradient Border Effect on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300 -z-10" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-100 transition-opacity duration-300 -z-10" />

              {/* Card Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-4xl mb-4 text-center">
                  {chapter.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 text-center transition-all duration-300">
                  {chapter.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4 text-center">
                  {chapter.description}
                </p>

                {/* Read Chapter Button */}
                <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-pink-500/25">
                  Read Chapter →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TextbookChapters;