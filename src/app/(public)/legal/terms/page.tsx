import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CLUB } from "@/lib/club-brand";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Términos y Condiciones
          </h1>
          <p className="text-muted-foreground">
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Aceptación de los Términos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Al acceder y utilizar el sitio web de {CLUB.shortName}, usted
              acepta estos términos y condiciones. Si no está de acuerdo, no
              debe utilizar nuestros servicios en línea.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Descripción del Servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {CLUB.shortName} es una comunidad estudiantil en la{" "}
              {CLUB.fullUniversity} dedicada a aprender AWS, construir proyectos
              en la nube y participar en eventos del grupo. Este sitio publica
              información del club y ofrece un panel interno para miembros del
              equipo organizador.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Información pública sobre eventos, proyectos y equipo</li>
              <li>Enlaces para unirse a la comunidad</li>
              <li>Panel de administración para voluntarios autorizados</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Cuentas de Usuario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              El acceso al panel administrativo requiere una cuenta autorizada.
              Usted es responsable de mantener la confidencialidad de sus
              credenciales y de toda actividad realizada con su cuenta.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Uso Aceptable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Usted se compromete a utilizar el sitio de forma respetuosa y a no:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Publicar contenido ofensivo, ilegal o engañoso</li>
              <li>Intentar acceder sin autorización a áreas restringidas</li>
              <li>Interferir con el funcionamiento del sitio</li>
              <li>Usar el sitio para fines ajenos a la comunidad del club</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Limitación de Responsabilidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              El sitio se ofrece &quot;tal como está&quot;. {CLUB.shortName} no
              garantiza disponibilidad continua ni ausencia de errores. Las
              actividades del club son de carácter formativo y comunitario.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Si tiene preguntas sobre estos términos, escríbanos a{" "}
              <a
                href={`mailto:${CLUB.email}`}
                className="text-primary hover:underline"
              >
                {CLUB.email}
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
