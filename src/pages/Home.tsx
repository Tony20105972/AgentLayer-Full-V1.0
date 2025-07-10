
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Store, Trophy, Zap, Shield, Users, ArrowRight, Play, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Bot,
      title: 'Drag-and-Drop Visual Builder',
      description: 'Create powerful AI workflows with ReactFlow-based visual editing.',
      path: '/builder',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Constitution Layer',
      description: 'Built-in rule enforcement and ethical constraints for every decision.',
      path: '/constitution',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Code2,
      title: 'Output Report Generator',
      description: 'Detailed HTML reports with full execution transparency.',
      path: '/dashboard',
      color: 'from-green-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Smart Flow Generator',
      description: 'AI-assisted workflow creation from natural language prompts.',
      path: '/builder',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const stats = [
    { label: 'Active Agents', value: '1,247' },
    { label: 'Community Members', value: '5,892' },
    { label: 'Successful Runs', value: '12.3K' },
    { label: 'Constitution Compliance', value: '99.2%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo placeholder - will be replaced with actual logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Samantha OS
              </span>
            </h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-2xl md:text-3xl font-medium text-gray-700 mb-4">
                "Built to Think. Bound by Rules."
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The first AI operating system that takes responsibility for every decision
              </p>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/builder')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Launch Builder
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 text-lg border-2"
              >
                <Play className="w-5 h-5 mr-2" />
                See It in Action
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Why Section */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <blockquote className="text-3xl md:text-4xl font-light text-gray-800 leading-relaxed">
            "Most AI agents make decisions.<br />
            <span className="font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Samantha takes responsibility.
            </span>"
          </blockquote>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI That Follows the Rules
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every feature designed with constitutional AI principles at its core
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <Card 
                className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white/60 backdrop-blur-sm border-gray-200/50"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-sm">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Constitution Layer Section */}
      <div className="relative z-10 bg-gray-900/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Constitutional AI Layer
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Every AI decision is governed by a transparent set of rules that you define. 
                No black boxes, no surprises—just accountable intelligence.
              </p>
              <Button
                onClick={() => navigate('/constitution')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Explore Constitution
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative"
            >
              <div className="bg-gray-900 rounded-lg p-6 text-sm font-mono text-green-400 shadow-2xl">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-400 text-xs">constitution.json</span>
                </div>
                <pre className="text-xs leading-relaxed">
{`{
  "no_PII": true,
  "must_cite_sources": true,
  "max_cost_per_call": 0.005,
  "ethical_guidelines": {
    "respect_privacy": true,
    "transparent_reasoning": true,
    "human_oversight": "required"
  },
  "violation_actions": {
    "block": ["PII_leak", "harmful_content"],
    "warn": ["high_cost", "uncertain_output"]
  }
}`}
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
