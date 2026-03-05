import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ClienteFormData } from "@/types/cliente";


interface ClienteFormProps {
  initialData?: ClienteFormData;
  isEditing: boolean;
  onSubmit: (data: ClienteFormData) => Promise<void> | void;
  onCancel?: () => void;
  loading: boolean;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ClienteFormData>({
    defaultValues: initialData || {
      mail: "",
      contraseña: "",
      repetirContraseña: "",
      nombre: "",
      apellido: "",
      tipoDoc: "DNI",
      nroDoc: "",
      fechaNacimiento: "",
      prefijo: "+54",
      telefono: "",
    },
  });

  const [countryCode, setCountryCode] = useState("+54");

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (key === "telefono" && value) {
          const match = value.match(/^(\+\d+)(.*)$/);
          if (match) {
            setCountryCode(match[1]);
            setValue("prefijo", match[1]);
            setValue("telefono", match[2]);
          } else {
            setValue("telefono", value);
          }
        } else {
          setValue(key as keyof ClienteFormData, value);
        }
      });
    }
  }, [initialData, setValue]);

  const onFormSubmit = async (data: ClienteFormData) => {
    const fullPhone = data.telefono ? `${data.prefijo || countryCode}${data.telefono}` : "";
    const { prefijo, ...submitData } = data;
    try {
      await onSubmit({ ...submitData, telefono: fullPhone });
    } catch (err: any) {
      if (err.isValidationError && err.details) {
        err.details.forEach((issue: { path: string, message: string }) => {
          let fieldName = issue.path;

          if (fieldName === "body.mail") fieldName = "mail";
          else if (fieldName === "body.contraseña") fieldName = "contraseña";
          else if (fieldName === "body.repetirContraseña") fieldName = "repetirContraseña";
          else if (fieldName === "body.nombre") fieldName = "nombre";
          else if (fieldName === "body.apellido") fieldName = "apellido";
          else if (fieldName === "body.tipoDoc") fieldName = "tipoDoc";
          else if (fieldName === "body.nroDoc") fieldName = "nroDoc";
          else if (fieldName === "body.fechaNacimiento") fieldName = "fechaNacimiento";
          else if (fieldName === "body.telefono") fieldName = "telefono";

          setError(fieldName as keyof ClienteFormData, {
            type: "backend",
            message: issue.message
          });
        });
      } else {
        throw err; // Propagate general errors up
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-4 p-4 bg-white rounded-lg shadow"
    >
      <div>
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          {...register("mail")}
          disabled={isEditing}
          className={`w-full p-2 border rounded ${errors.mail ? 'border-red-500' : ''}`}
        />
        {errors.mail && <p className="text-red-500 text-xs mt-1">{errors.mail.message}</p>}
      </div>

      {!isEditing && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Contraseña</label>
            <input
              type="password"
              {...register("contraseña")}
              className={`w-full p-2 border rounded ${errors.contraseña ? 'border-red-500' : ''}`}
            />
            {errors.contraseña && <p className="text-red-500 text-xs mt-1">{errors.contraseña.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Repetir Contraseña</label>
            <input
              type="password"
              {...register("repetirContraseña")}
              className={`w-full p-2 border rounded ${errors.repetirContraseña ? 'border-red-500' : ''}`}
            />
            {errors.repetirContraseña && <p className="text-red-500 text-xs mt-1">{errors.repetirContraseña.message}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">Nombre</label>
          <input
            type="text"
            {...register("nombre")}
            className={`w-full p-2 border rounded ${errors.nombre ? 'border-red-500' : ''}`}
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Apellido</label>
          <input
            type="text"
            {...register("apellido")}
            className={`w-full p-2 border rounded ${errors.apellido ? 'border-red-500' : ''}`}
          />
          {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Tipo Documento
          </label>
          <select
            {...register("tipoDoc")}
            className="w-full p-2 border rounded"
          >
            <option value="DNI">DNI</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Cédula">Cédula</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Número Documento
          </label>
          <input
            type="text"
            {...register("nroDoc")}
            className={`w-full p-2 border rounded ${errors.nroDoc ? 'border-red-500' : ''}`}
          />
          {errors.nroDoc && <p className="text-red-500 text-xs mt-1">{errors.nroDoc.message}</p>}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Fecha Nacimiento
        </label>
        <input
          type="date"
          {...register("fechaNacimiento")}
          className={`w-full p-2 border rounded ${errors.fechaNacimiento ? 'border-red-500' : ''}`}
        />
        {errors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento.message}</p>}
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Teléfono</label>
        <div className="flex gap-2">
          <select
            {...register("prefijo")}
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-24 p-2 border rounded bg-gray-50"
          >
            <option value="+93">Afganistán (+93)</option>
            <option value="+355">Albania (+355)</option>
            <option value="+213">Argelia (+213)</option>
            <option value="+376">Andorra (+376)</option>
            <option value="+244">Angola (+244)</option>
            <option value="+54">Argentina (+54)</option>
            <option value="+374">Armenia (+374)</option>
            <option value="+297">Aruba (+297)</option>
            <option value="+61">Australia (+61)</option>
            <option value="+43">Austria (+43)</option>
            <option value="+994">Azerbaiyán (+994)</option>
            <option value="+973">Baréin (+973)</option>
            <option value="+880">Bangladesh (+880)</option>
            <option value="+375">Bielorrusia (+375)</option>
            <option value="+32">Bélgica (+32)</option>
            <option value="+501">Belice (+501)</option>
            <option value="+229">Benín (+229)</option>
            <option value="+975">Bután (+975)</option>
            <option value="+591">Bolivia (+591)</option>
            <option value="+387">Bosnia y Herzegovina (+387)</option>
            <option value="+267">Botsuana (+267)</option>
            <option value="+55">Brasil (+55)</option>
            <option value="+673">Brunéi (+673)</option>
            <option value="+359">Bulgaria (+359)</option>
            <option value="+226">Burkina Faso (+226)</option>
            <option value="+257">Burundi (+257)</option>
            <option value="+855">Camboya (+855)</option>
            <option value="+237">Camerún (+237)</option>
            <option value="+1">Canadá/EE. UU. (+1)</option>
            <option value="+238">Cabo Verde (+238)</option>
            <option value="+236">República Centroafricana (+236)</option>
            <option value="+235">Chad (+235)</option>
            <option value="+56">Chile (+56)</option>
            <option value="+86">China (+86)</option>
            <option value="+57">Colombia (+57)</option>
            <option value="+269">Comoras (+269)</option>
            <option value="+242">República del Congo (+242)</option>
            <option value="+243">República Democrática del Congo (+243)</option>
            <option value="+682">Islas Cook (+682)</option>
            <option value="+506">Costa Rica (+506)</option>
            <option value="+225">Costa de Marfil (+225)</option>
            <option value="+385">Croacia (+385)</option>
            <option value="+53">Cuba/República Dominicana (+53)</option>
            <option value="+357">Chipre (+357)</option>
            <option value="+420">República Checa (+420)</option>
            <option value="+45">Dinamarca (+45)</option>
            <option value="+253">Yibuti (+253)</option>
            <option value="+670">Timor Oriental (+670)</option>
            <option value="+593">Ecuador (+593)</option>
            <option value="+20">Egipto (+20)</option>
            <option value="+503">El Salvador (+503)</option>
            <option value="+240">Guinea Ecuatorial (+240)</option>
            <option value="+291">Eritrea (+291)</option>
            <option value="+372">Estonia (+372)</option>
            <option value="+251">Etiopía (+251)</option>
            <option value="+298">Islas Feroe (+298)</option>
            <option value="+679">Fiyi (+679)</option>
            <option value="+358">Finlandia (+358)</option>
            <option value="+33">Francia (+33)</option>
            <option value="+241">Gabón (+241)</option>
            <option value="+995">Georgia (+995)</option>
            <option value="+49">Alemania (+49)</option>
            <option value="+233">Ghana (+233)</option>
            <option value="+350">Gibraltar (+350)</option>
            <option value="+30">Grecia (+30)</option>
            <option value="+502">Guatemala (+502)</option>
            <option value="+224">Guinea (+224)</option>
            <option value="+245">Guinea-Bisáu (+245)</option>
            <option value="+592">Guyana (+592)</option>
            <option value="+509">Haití (+509)</option>
            <option value="+504">Honduras (+504)</option>
            <option value="+36">Hungría (+36)</option>
            <option value="+354">Islandia (+354)</option>
            <option value="+91">India (+91)</option>
            <option value="+62">Indonesia (+62)</option>
            <option value="+964">Irak (+964)</option>
            <option value="+98">Irán (+98)</option>
            <option value="+353">Irlanda (+353)</option>
            <option value="+39">Italia (+39)</option>
            <option value="+1876">Jamaica (+1876)</option>
            <option value="+81">Japón (+81)</option>
            <option value="+962">Jordania (+962)</option>
            <option value="+7">Kazajistán/Kirguistán/Rusia (+7)</option>
            <option value="+254">Kenia (+254)</option>
            <option value="+686">Kiribati (+686)</option>
            <option value="+965">Kuwait (+965)</option>
            <option value="+996">Kirguistán (+996)</option>
            <option value="+856">Laos (+856)</option>
            <option value="+371">Letonia (+371)</option>
            <option value="+961">Líbano (+961)</option>
            <option value="+266">Lesoto (+266)</option>
            <option value="+231">Liberia (+231)</option>
            <option value="+218">Libia (+218)</option>
            <option value="+423">Liechtenstein (+423)</option>
            <option value="+370">Lituania (+370)</option>
            <option value="+352">Luxemburgo (+352)</option>
            <option value="+853">Macao (+853)</option>
            <option value="+389">Macedonia del Norte (+389)</option>
            <option value="+261">Madagascar (+261)</option>
            <option value="+265">Malaui (+265)</option>
            <option value="+60">Malasia (+60)</option>
            <option value="+960">Maldivas (+960)</option>
            <option value="+223">Malí (+223)</option>
            <option value="+356">Malta (+356)</option>
            <option value="+692">Islas Marshall (+692)</option>
            <option value="+596">Martinica (+596)</option>
            <option value="+222">Mauritania (+222)</option>
            <option value="+230">Mauricio (+230)</option>
            <option value="+52">México (+52)</option>
            <option value="+691">Micronesia (+691)</option>
            <option value="+373">Moldavia (+373)</option>
            <option value="+377">Mónaco (+377)</option>
            <option value="+976">Mongolia (+976)</option>
            <option value="+382">Montenegro (+382)</option>
            <option value="+212">Marruecos (+212)</option>
            <option value="+258">Mozambique (+258)</option>
            <option value="+95">Myanmar (+95)</option>
            <option value="+264">Namibia (+264)</option>
            <option value="+674">Nauru (+674)</option>
            <option value="+977">Nepal (+977)</option>
            <option value="+31">Países Bajos (+31)</option>
            <option value="+687">Nueva Caledonia (+687)</option>
            <option value="+64">Nueva Zelanda (+64)</option>
            <option value="+505">Nicaragua (+505)</option>
            <option value="+227">Níger (+227)</option>
            <option value="+234">Nigeria (+234)</option>
            <option value="+683">Niue (+683)</option>
            <option value="+850">Corea del Norte (+850)</option>
            <option value="+47">Noruega (+47)</option>
            <option value="+968">Omán (+968)</option>
            <option value="+92">Pakistán (+92)</option>
            <option value="+680">Palaos (+680)</option>
            <option value="+507">Panamá (+507)</option>
            <option value="+675">Papúa Nueva Guinea (+675)</option>
            <option value="+595">Paraguay (+595)</option>
            <option value="+51">Perú (+51)</option>
            <option value="+63">Filipinas (+63)</option>
            <option value="+48">Polonia (+48)</option>
            <option value="+351">Portugal (+351)</option>
            <option value="+974">Catar (+974)</option>
            <option value="+40">Rumania (+40)</option>
            <option value="+250">Ruanda (+250)</option>
            <option value="+685">Samoa (+685)</option>
            <option value="+378">San Marino (+378)</option>
            <option value="+239">Santo Tomé y Príncipe (+239)</option>
            <option value="+966">Arabia Saudita (+966)</option>
            <option value="+221">Senegal (+221)</option>
            <option value="+381">Serbia (+381)</option>
            <option value="+248">Seychelles (+248)</option>
            <option value="+232">Sierra Leona (+232)</option>
            <option value="+65">Singapur (+65)</option>
            <option value="+421">Eslovaquia (+421)</option>
            <option value="+386">Eslovenia (+386)</option>
            <option value="+677">Islas Salomón (+677)</option>
            <option value="+252">Somalia (+252)</option>
            <option value="+27">Sudáfrica (+27)</option>
            <option value="+211">Sudán del Sur (+211)</option>
            <option value="+249">Sudán (+249)</option>
            <option value="+46">Suecia (+46)</option>
            <option value="+41">Suiza (+41)</option>
            <option value="+963">Siria (+963)</option>
            <option value="+886">Taiwán (+886)</option>
            <option value="+66">Tailandia (+66)</option>
            <option value="+992">Tayikistán (+992)</option>
            <option value="+228">Togo (+228)</option>
            <option value="+676">Tonga (+676)</option>
            <option value="+1868">Trinidad y Tobago (+1868)</option>
            <option value="+216">Túnez (+216)</option>
            <option value="+90">Turquía (+90)</option>
            <option value="+993">Turkmenistán (+993)</option>
            <option value="+1649">Islas Turcas y Caicos (+1649)</option>
            <option value="+688">Tuvalu (+688)</option>
            <option value="+256">Uganda (+256)</option>
            <option value="+380">Ucrania (+380)</option>
            <option value="+971">Emiratos Árabes Unidos (+971)</option>
            <option value="+44">Reino Unido (+44)</option>
            <option value="+598">Uruguay (+598)</option>
            <option value="+998">Uzbekistán (+998)</option>
            <option value="+678">Vanuatu (+678)</option>
            <option value="+58">Venezuela (+58)</option>
            <option value="+84">Vietnam (+84)</option>
            <option value="+681">Wallis y Futuna (+681)</option>
            <option value="+967">Yemen (+967)</option>
            <option value="+260">Zambia (+260)</option>
            <option value="+263">Zimbabue (+263)</option>
          </select>
          <input
            type="tel"
            {...register("telefono")}
            className={`flex-1 p-2 border rounded ${errors.telefono ? 'border-red-500' : ''}`}
            placeholder="Ej: 1122334455"
          />
        </div>
        {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
