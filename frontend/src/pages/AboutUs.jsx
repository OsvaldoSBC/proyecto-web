import { Flag, Globe, Users, Target } from 'lucide-react'

function AboutUs() {
  return (
    <div className="space-y-16 animate-fade-in pb-20">
      
      {/* HERO SECTION */}
      <div className="text-center py-10">
        <h1 className="text-5xl md:text-7xl font-black italic uppercase text-white tracking-tighter mb-6">
          Nuestra <span className="text-[#E10600]">Pasión</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Conectamos a los fanáticos con la velocidad. RacingHub es la plataforma centralizada para seguir el pulso del automovilismo global.
        </p>
      </div>

      {/* MISION Y VISION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
              <div className="flex items-start gap-4">
                  <div className="bg-[#E10600]/10 p-3 rounded-lg text-[#E10600]">
                      <Flag size={32} />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-white uppercase italic">Nuestra Misión</h3>
                      <p className="text-gray-400 mt-2 leading-relaxed">
                          Democratizar la información del automovilismo, brindando un espacio donde categorías de todos los niveles tengan la visibilidad que merecen, y donde los fans encuentren resultados veraces al instante.
                      </p>
                  </div>
              </div>

              <div className="flex items-start gap-4">
                  <div className="bg-[#E10600]/10 p-3 rounded-lg text-[#E10600]">
                      <Target size={32} />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-white uppercase italic">Nuestra Visión</h3>
                      <p className="text-gray-400 mt-2 leading-relaxed">
                          Convertirnos en el ecosistema digital estándar para equipos, pilotos y organizaciones de carreras, facilitando la gestión deportiva y la conexión con la audiencia.
                      </p>
                  </div>
              </div>
          </div>

          {/* IMAGEN DECORATIVA */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group">
              <img 
                src="https://lirp.cdn-website.com/6439d66a/dms3rep/multi/opt/235187309_169906585236928_3707581574888811447_n-640w.jpg" 
                alt="Racing Passion" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
      </div>

      {/* STATS */}
      <div className="bg-[#1E1E1E] border border-gray-800 rounded-2xl p-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
              <Users size={40} className="text-[#E10600] mx-auto mb-4"/>
              <h4 className="text-4xl font-black text-white">10k+</h4>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-widest mt-2">Usuarios Activos</p>
          </div>
          <div>
              <Globe size={40} className="text-[#E10600] mx-auto mb-4"/>
              <h4 className="text-4xl font-black text-white">15+</h4>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-widest mt-2">Categorías Oficiales</p>
          </div>
          <div>
              <Flag size={40} className="text-[#E10600] mx-auto mb-4"/>
              <h4 className="text-4xl font-black text-white">500+</h4>
              <p className="text-gray-500 uppercase text-xs font-bold tracking-widest mt-2">Carreras Cubiertas</p>
          </div>
      </div>

    </div>
  )
}

export default AboutUs