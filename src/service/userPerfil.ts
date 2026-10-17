import { supabase } from "@/supabase";

export function usePerfil() {
    async function PerfilInfoAdd(nameUser: string, dt_nasc: Date, nicknameUser: string, fotoUrl: string, foto: File) {
        const { data: { user }, error: UserError } = await supabase.auth.getUser();

        if (UserError) throw UserError;
        if (!user) throw new Error("Usuário não autenticado");

        const { data, error } = await supabase
            .from('perfil')
            .update({
                nome: nameUser,
                data_nascimento: dt_nasc,
                nickname: nicknameUser,
                foto_url: fotoUrl
            })
            .eq("id", user.id);

        if (error) throw error;

        await uploadImagem(fotoUrl, foto);

        return data
    }

    async function uploadImagem(imageUrl: string, image: File) {
        const {data, error } = await supabase.storage.from('fotos-perfil').upload(imageUrl, image, {
            contentType: 'image/jpeg',
        })

        if (error) {
            throw error
        }

        return data.path
    }

    return {
        PerfilInfoAdd
    }
}