import { VKID } from '@vkid/sdk';

const vkid = new VKID({
    appId: 12345678, // ID вашего приложения ВКонтакте
    redirectUri: 'https://your-redirect-url.com', // URL редиректа после авторизации
});

// Проверка ID пользователя и публикация поста
export async function useVK(text: string, images: File[]) {
    try {
        // Авторизация
        const { userId, accessToken } = await vkid.auth();

        if (userId !== 30008485) {
            throw new Error('Доступ запрещен: только пользователь с ID 30008485 может публиковать посты.');
        }

        const attachments: string[] = [];

        if (images.length > 0) {
            // Загрузка изображений
            for (const image of images) {
                const formData = new FormData();
                formData.append('file', image);

                const uploadResponse = await fetch(
                    `https://api.vk.com/method/photos.getWallUploadServer?access_token=${accessToken}&v=5.131`,
                    { method: 'GET' }
                );

                const { response: uploadUrl } = await uploadResponse.json();
                const uploadResult = await fetch(uploadUrl.upload_url, {
                    method: 'POST',
                    body: formData,
                });

                const { photo, server, hash } = await uploadResult.json();

                const saveResponse = await fetch(
                    `https://api.vk.com/method/photos.saveWallPhoto?access_token=${accessToken}&v=5.131&photo=${photo}&server=${server}&hash=${hash}`,
                    { method: 'GET' }
                );

                const { response } = await saveResponse.json();
                attachments.push(response[0].id);
            }
        }

        // Публикация поста
        const postResponse = await fetch(
            `https://api.vk.com/method/wall.post?access_token=${accessToken}&v=5.131`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    attachments: attachments.join(','),
                }),
            }
        );

        const result = await postResponse.json();
        if (result.error) {
            throw new Error(`Ошибка публикации: ${result.error.error_msg}`);
        }

        alert('Пост успешно опубликован в ВК!');
    } catch (error) {
        console.error(error);
        alert(`Ошибка: ${error.message}`);
    }
}