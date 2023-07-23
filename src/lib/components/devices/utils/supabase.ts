import { supabase } from '../../../../supabaseClient';
import type { IAnimation, ILayer, IShape } from '../../../../interfaces/interfaces';
import type { Session } from '@supabase/supabase-js';

export const getShapes = async (my_session: Session, animations: IAnimation[]) => {
	try {
		const { data } = await supabase
			.from('shapes')
			.select('*')
			.eq('owner_id', my_session.user.id)
			.order('id', { ascending: false });

		data?.forEach((d: IShape) => {
			d.layers.forEach((l: ILayer) => {
				if (l.animation) {
					const animationFinded = animations.find((a) => a.id === l.animation?.id);
					if (animationFinded) {
						l.animation.function = animationFinded.function;
					}
				}
			});
		});

		return data;
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
		}
	}

	return [];
};
