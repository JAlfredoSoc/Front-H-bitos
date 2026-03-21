function SeccionInformativa() {
  return (
    <>
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80"
                alt="Hábitos saludables"
                className="img-fluid rounded-4 shadow"
              />
            </div>

            <div className="col-md-6">
              <h2 className="fw-bold mb-3">¿Por qué es importante mejorar los hábitos?</h2>
              <p className="text-muted fs-5">
                Los hábitos influyen directamente en nuestra salud, productividad
                y bienestar emocional. Pequeñas acciones repetidas diariamente
                pueden generar grandes cambios a largo plazo.
              </p>
              <p className="text-muted">
                Con una buena gestión de hábitos puedes organizar mejor tu tiempo,
                mantener constancia en tus objetivos y construir una rutina más
                saludable y equilibrada.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Beneficios de crear hábitos positivos</h2>
            <p className="text-muted fs-5">
              Mejora tu vida con constancia, disciplina y seguimiento diario.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80"
                  alt="Salud física"
                  className="card-img-top rounded-top-4"
                  style={{ height: '230px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h4 className="fw-bold">Mejora tu salud</h4>
                  <p className="text-muted">
                    Mantener hábitos saludables como hacer ejercicio, dormir bien
                    y alimentarte correctamente fortalece tu cuerpo y mente.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <img
                  src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80"
                  alt="Productividad"
                  className="card-img-top rounded-top-4"
                  style={{ height: '230px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h4 className="fw-bold">Aumenta tu productividad</h4>
                  <p className="text-muted">
                    Una rutina organizada te ayuda a aprovechar mejor el tiempo,
                    cumplir metas y mantener un mejor enfoque en tus actividades.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
                  alt="Bienestar emocional"
                  className="card-img-top rounded-top-4"
                  style={{ height: '230px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h4 className="fw-bold">Fortalece tu bienestar</h4>
                  <p className="text-muted">
                    Los buenos hábitos contribuyen a reducir el estrés, aumentar
                    la motivación y mejorar tu calidad de vida en general.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SeccionInformativa;