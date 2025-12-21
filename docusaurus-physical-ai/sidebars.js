/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  textbookSidebar: [
    {
      type: 'doc',
      id: 'index', // Main index page
      label: 'Physical AI Textbook'
    },
    {
      type: 'category',
      label: 'Chapter 1: Introduction to Physical AI',
      items: [
        'chapter_1/lesson_1_1_what_is_physical_ai',
        'chapter_1/lesson_1_2_history_evolution_physical_ai',
        'chapter_1/lesson_1_3_applications_use_cases',
        'chapter_1/lesson_1_4_introduction_ai_agents',
        'chapter_1/lesson_1_5_setting_up_development_environment'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 2: Specification-Driven Design',
      items: [
        'chapter_2/lesson_2_1_principles_specification_first_thinking',
        'chapter_2/lesson_2_2_writing_clear_system_specifications',
        'chapter_2/lesson_2_3_specification_validation_techniques',
        'chapter_2/lesson_2_4_collaborative_specification_development',
        'chapter_2/lesson_2_5_specification_versioning_management'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 3: Simulation Environments',
      items: [
        'chapter_3/lesson_3_1_introduction_simulation_platforms',
        'chapter_3/lesson_3_2_building_basic_simulation_environments',
        'chapter_3/lesson_3_3_physics_modeling_simulation',
        'chapter_3/lesson_3_4_environment_testing_validation',
        'chapter_3/lesson_3_5_optimization_techniques_simulation'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 4: AI Agent Collaboration',
      items: [
        'chapter_4/lesson_4_1_understanding_ai_agent_capabilities',
        'chapter_4/lesson_4_2_designing_human_ai_collaboration_workflows',
        'chapter_4/lesson_4_3_prompt_engineering_physical_ai_tasks',
        'chapter_4/lesson_4_4_iterative_development_ai_agents',
        'chapter_4/lesson_4_5_evaluating_ai_agent_contributions'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 5: Basic Movement and Control',
      items: [
        'chapter_5/lesson_5_1_fundamentals_movement_control',
        'chapter_5/lesson_5_2_simple_motion_planning',
        'chapter_5/lesson_5_3_control_systems_feedback',
        'chapter_5/lesson_5_4_path_planning_algorithms',
        'chapter_5/lesson_5_5_movement_optimization'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 6: Sensor Integration and Perception',
      items: [
        'chapter_6/lesson_6_1_introduction_sensor_types',
        'chapter_6/lesson_6_2_sensor_data_processing',
        'chapter_6/lesson_6_3_perception_systems_simulation',
        'chapter_6/lesson_6_4_sensor_fusion_techniques',
        'chapter_6/lesson_6_5_perception_based_decision_making'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 7: Advanced Physical AI Systems',
      items: [
        'chapter_7/lesson_7_1_complex_system_architecture',
        'chapter_7/lesson_7_2_multi_agent_physical_systems',
        'chapter_7/lesson_7_3_learning_adaptation',
        'chapter_7/lesson_7_4_safety_robustness',
        'chapter_7/lesson_7_5_performance_optimization'
      ]
    },
    {
      type: 'category',
      label: 'Chapter 8: Deployment and Real-World Applications',
      items: [
        'chapter_8/lesson_8_1_transitioning_simulation_reality',
        'chapter_8/lesson_8_2_hardware_integration_considerations',
        'chapter_8/lesson_8_3_real_world_testing_strategies',
        'chapter_8/lesson_8_4_deployment_best_practices',
        'chapter_8/lesson_8_5_future_physical_ai'
      ]
    }
  ]
};
