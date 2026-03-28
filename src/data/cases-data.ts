import { CheckCircle2, Clock, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CaseResult = {
  icon: LucideIcon;
  metric: string;
  label: string;
};

export type CaseItem = {
  title: string;
  industry: string;
  image: string;
  location: string;
  services: string[];
  description: string;
  problem: string;
  solution: string;
  results: CaseResult[];
};

export const cases: CaseItem[] = [
  {
    title: "Maintech",
    industry: "Educación",
    image: "/cases/maintech.jpg",
    location: "Perú",
    services: [
      "Plataforma E-Learning",
      "Gestión de Cursos",
      "Dashboard Estudiantil",
    ],
    description:
      "Plataforma e-learning integral con gestión de cursos, dashboards estudiantiles y sistemas de seguimiento de progreso con inscripción a cursos, módulos de aprendizaje por capítulos, certificados de finalización y monitoreo de progreso en tiempo real.",
    problem:
      "Necesidad de una plataforma educativa integral para gestión de cursos, seguimiento de estudiantes y certificación de progreso.",
    solution:
      "Plataforma e-learning completa con gestión de cursos, dashboards estudiantiles personalizados, módulos de aprendizaje por capítulos, certificados de finalización y monitoreo de progreso en tiempo real con interfaces interactivas.",
    results: [
      {
        icon: Users,
        metric: "100%",
        label: "tasa de inscripción en cursos",
      },
      {
        icon: Clock,
        metric: "80%",
        label: "mejora en tiempo de gestión de cursos",
      },
      {
        icon: CheckCircle2,
        metric: "95%",
        label: "satisfacción de estudiantes con la plataforma",
      },
    ],
  },
  {
    title: "Breezy",
    industry: "Manufactura",
    image: "/cases/breezy.png",
    location: "Ukraine",
    services: ["Corporate Website", "UX/UI Design"],
    description:
      "Scalable multilingual B2B web platform for corporate IT refurbishment and content automation",
    problem:
      "Procesos de inventario y producción controlados mediante hojas de cálculo y comunicación manual entre departamentos, generando desajustes constantes y pérdidas por obsolescencia.",
    solution:
      "Implementamos un sistema de gestión integrado con IoT para monitoreo en tiempo real, algoritmos de planificación de producción basados en demanda predictiva y automatización completa de órdenes de trabajo.",
    results: [
      {
        icon: Clock,
        metric: "72%",
        label: "reducción en tiempo de gestión operativa",
      },
      {
        icon: TrendingUp,
        metric: "48%",
        label: "incremento en throughput de producción",
      },
      {
        icon: CheckCircle2,
        metric: "99.2%",
        label: "precisión en inventario en tiempo real",
      },
    ],
  },
  {
    title: "Stark Research 4.0",
    industry: "Logística",
    image: "/cases/stark-research.png",
    location: "Ukraine",
    services: ["Portals and Services", "Mobile App Development"],
    description: "Analytical web and mobile application for shipping logistics",
    problem:
      "Sistemas dispares de seguimiento generando información desincronizada, falta de visibilidad en cadena de suministro y altos costos por consultas manuales de clientes.",
    solution:
      "Plataforma unificada con API-first architecture, integración GPS en tiempo real, sistema de notificaciones push automatizado y dashboard analítico para optimización de rutas mediante machine learning.",
    results: [
      {
        icon: Users,
        metric: "3.5x",
        label: "mejora en NPS de satisfacción del cliente",
      },
      {
        icon: Clock,
        metric: "68%",
        label: "reducción en consultas de soporte manual",
      },
      {
        icon: TrendingUp,
        metric: "2.8x",
        label: "aumento en capacidad de procesamiento diario",
      },
    ],
  },
  {
    title: "Sailica 2.0",
    industry: "Servicios Financieros",
    image: "/cases/sailica.png",
    location: "United Kingdom",
    services: ["Decision Engine", "Security", "Regulatory Compliance"],
    description: "Yacht charter online booking platform",
    problem:
      "Evaluación crediticia basada en análisis manual, tiempos de aprobación de 7-15 días, riesgo de incumplimiento normativo y capacidad limitada para escalar operaciones.",
    solution:
      "Motor de decisión automatizado con scoring avanzado, integración con bureaus de crédito, workflow engine configurable y sistema de audit trail completo para compliance regulatorio.",
    results: [
      {
        icon: Clock,
        metric: "85%",
        label: "reducción en tiempo de aprobación (horas vs días)",
      },
      {
        icon: CheckCircle2,
        metric: "100%",
        label: "cumplimiento normativo certificado",
      },
      {
        icon: TrendingUp,
        metric: "6x",
        label: "aumento en volumen de créditos procesados",
      },
    ],
  },
  {
    title: "Retail Cloud Platform",
    industry: "Retail",
    image: "/cases/retail-platform.png",
    location: "México",
    services: [
      "Cloud ERP",
      "Business Intelligence",
      "Multi-tenant Architecture",
    ],
    description:
      "Cloud-native ERP with multi-tenant architecture for retail chains",
    problem:
      "Datos de inventario y ventas fragmentados entre múltiples sistemas locales, imposibilitando análisis consolidado y gestión centralizada de precios y promociones.",
    solution:
      "ERP cloud-native con arquitectura multi-tenant, sincronización bidireccional en tiempo real, módulos de BI integrado y sistema de pricing dinámico basado en algoritmos de demanda.",
    results: [
      {
        icon: TrendingUp,
        metric: "38%",
        label: "incremento en revenue por optimización de pricing",
      },
      {
        icon: Clock,
        metric: "55%",
        label: "reducción en tiempo de procesos administrativos",
      },
      {
        icon: Users,
        metric: "100%",
        label: "visibilidad consolidada multi-sucursal en tiempo real",
      },
    ],
  },
  {
    title: "EduSuite Platform",
    industry: "Educación",
    image: "/cases/edusuite.png",
    location: "Colombia",
    services: ["LMS Platform", "Payment Gateway", "Academic Analytics"],
    description:
      "Integrated educational suite with student portal and payment system",
    problem:
      "Múltiples plataformas desconectadas para gestión académica, pagos y comunicación, generando duplicación de datos y procesos manuales repetitivos para administradores.",
    solution:
      "Suite educativa integral con portal estudiantil personalizado, sistema de pagos en línea con múltiples métodos, automatización de certificados y reporting académico avanzado con analytics predictivo.",
    results: [
      {
        icon: Users,
        metric: "94%",
        label: "tasa de adopción de usuarios en primer trimestre",
      },
      {
        icon: Clock,
        metric: "70%",
        label: "reducción en carga administrativa operativa",
      },
      {
        icon: CheckCircle2,
        metric: "100%",
        label: "trazabilidad completa de transacciones financieras",
      },
    ],
  },
  {
    title: "MediCare EMR",
    industry: "Salud",
    image: "/cases/medicare-emr.png",
    location: "Chile",
    services: ["EMR System", "HIPAA Compliance", "Cloud Infrastructure"],
    description: "HIPAA-compliant clinical management system with telemedicine",
    problem:
      "Agendamiento telefónico ineficiente, expedientes clínicos en papel propensos a pérdidas, y falta de integración entre módulos de facturación y historial médico.",
    solution:
      "Sistema clínico HIPAA-compliant con agendamiento online inteligente, historial médico electrónico (EMR), facturación automatizada y telemedicina integrada con video-consulta.",
    results: [
      {
        icon: Users,
        metric: "55%",
        label: "incremento en capacidad de pacientes atendidos mensualmente",
      },
      {
        icon: Clock,
        metric: "78%",
        label: "reducción en tiempos de espera en sala",
      },
      {
        icon: CheckCircle2,
        metric: "0",
        label: "incidentes de expedientes perdidos (antes: 12% anual)",
      },
    ],
  },
];
